# backend/subscriptions/views.py

from django.db import transaction  
from django.db.models.deletion import ProtectedError
from django.contrib.auth.models import User, Group
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from backend import settings
from .models import Profile, Exercise, Routine, RoutineExercise , RunningPlan ,Payment
from rest_framework.permissions import IsAuthenticated
import json
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponseBadRequest
from django.contrib.auth.forms import PasswordResetForm

from django.conf import settings
from django.template.loader import render_to_string
from mailjet_rest import Client
import logging


from .serializers import (
    ClientSerializer,
    ProfileSerializer,
    ExerciseSerializer,
    RoutineSerializer,
    SimpleUserSerializer,
    RunningPlanSerializer,
    
)


logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_trainers(request):
    qs = User.objects.filter(groups__name='Trainer')
    return Response(SimpleUserSerializer(qs, many=True).data)

# 1) Endpoint /api/me/ para que cualquier user vea/edite su propio perfil
@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == 'PUT':
        ser = ProfileSerializer(profile, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
    else:
        ser = ProfileSerializer(profile)
    data = ser.data
    data['groups'] = [g.name for g in request.user.groups.all()]
    return Response(data)


# 2) Permiso que verifica que seas Trainer
class IsTrainer(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name='Trainer').exists()
        )


# 3) ViewSet para que los trainers gestionen sus clientes Y sus rutinas anidadas
class TrainerViewSet(viewsets.GenericViewSet):
    queryset = User.objects.filter(groups__name='Clients')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def get_serializer_class(self):
        if self.action in ('profile',):
            return ProfileSerializer
        if self.action == 'routines':
            return RoutineSerializer
        return ClientSerializer

    # — Clientes —
    @action(detail=False, methods=['get'], url_path='clients')
    def list_clients(self, request):
        clients = self.get_queryset()
        ser = ClientSerializer(clients, many=True)
        return Response(ser.data)



    @action(detail=False, methods=['post'], url_path='create-client')
    def create_client(self, request):
        ser = ClientSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        # crea User sin contraseña
        user = User.objects.create(
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            is_active=False,
        )
        user.set_unusable_password()
        user.save()

        # crea Profile
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.phone = data['phone']
        profile.save()

        # añade al grupo Clients
        grp, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(grp)

        # Genera UID y token para el enlace de creación de contraseña
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        url   = request.build_absolute_uri(
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )

        # Renderiza la plantilla de email con contexto
        html_content = render_to_string('registration/password_reset_email.html', {
            'user': user,
            'protocol': request.scheme,
            'domain': request.get_host(),
            'uid': uid,
            'token': token,
            'url': url,
        })

        # Configura y envía vía Mailjet REST API
        mailjet = Client(auth=(
            settings.EMAIL_HOST_USER,
            settings.EMAIL_HOST_PASSWORD
        ), version='v3.1')

        data_mail = {
            'Messages': [
                {
                    'From': {
                        'Email': 'bajoentrena@gmail.com',
                        'Name':  'El Bajo Entrena'
                    },
                    'To': [
                        {'Email': user.email, 'Name': user.first_name}
                    ],
                    'Subject': 'Configura tu contraseña en El Bajo Entrena',
                    'HTMLPart': html_content
                }
            ]
        }

        result = mailjet.send.create(data=data_mail)
        if result.status_code == 200:
            logger.info("Mailjet REST API: email enviado correctamente a %s", user.email)
        else:
            logger.error(
                "Mailjet REST API error %s: %s",
                result.status_code,
                result.json()
            )

        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'put'], url_path='profile')
    def profile(self, request, pk=None):
        user = self.get_object()
        profile, _ = Profile.objects.get_or_create(user=user)

        if request.method == 'PUT':
            ser = ProfileSerializer(profile, data=request.data, partial=True)
            ser.is_valid(raise_exception=True)
            ser.save()
            return Response(ser.data)

        ser = ProfileSerializer(profile)
        return Response(ser.data)

    # — Rutinas anidadas —
    @action(detail=True, methods=['get','post','put'], url_path='routines')
    def routines(self, request, pk=None):
        client = self.get_object()

        if request.method == 'GET':
            qs = client.routines.all()
            return Response(RoutineSerializer(qs, many=True).data)

        data = request.data

        inst = None
        if request.method == 'PUT' and data.get('id'):
            inst = Routine.objects.get(pk=data['id'], client=client)

        ser = RoutineSerializer(instance=inst, data=data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)


# 4) ViewSets separados para ejercicios reutilizables
class ExerciseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para que el Trainer gestione ejercicios.
    Al eliminar un Exercise, primero elimina TODOS los RoutineExercise que lo referencian,
    y luego borra el propio Exercise. Captura ProtectedError y otros errores inesperados.
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def destroy(self, request, *args, **kwargs):
        """
        Override de destroy() para:
        1) Borrar primero todas las filas de RoutineExercise que referencian a este Exercise.
        2) Intentar borrar el Exercise en sí dentro de una transacción atómica.
        3) Capturar ProtectedError (si por algún motivo aún queda FK protegida).
        4) Capturar cualquier otro error y volcar el traceback en los logs.
        """
        instance = self.get_object()

        try:
            with transaction.atomic():
                # 1) Eliminar explícitamente todas las relaciones en RoutineExercise:
                RoutineExercise.objects.filter(exercise=instance).delete()

                # 2) Intentar borrar el Exercise:
                #    perform_destroy internamente hace instance.delete()
                self.perform_destroy(instance)

        except ProtectedError:
            # Si por alguna razón sigue habiendo relaciones protegidas (on_delete=PROTECT),
            # devolvemos un 400 con mensaje legible para el frontend.
            return Response(
                {"detail": "No se puede eliminar: este ejercicio está en uso en alguna rutina."},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            # Vuelca el traceback en los logs de PythonAnywhere para que puedas depurar
            import traceback
            traceback.print_exc()

            # Devolvemos un 500 con mensaje genérico al cliente JS
            return Response(
                {"detail": f"Error interno al eliminar el ejercicio: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Si no hubo excepción, devolvemos 204 No Content
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        """
        Por seguridad, también sobreescribimos perform_destroy() para asegurarnos
        de que, aunque por alguna razón no se invoque destroy(), cualquier borrado
        pase por este método (p. ej. si algún otro código llamara a perform_destroy()).
        """
        try:
            # (Repetimos la misma lógica de borrar relaciones, por si acaso)
            RoutineExercise.objects.filter(exercise=instance).delete()
            super().perform_destroy(instance)
        except ProtectedError:
            # Si aquí surge un ProtectedError, lo re-lanzamos para que el método destroy lo capture.
            raise
        except Exception as e:
            # Si llega aquí, agrégalo al log para no “tragarte” silenciosamente el error.
            import traceback
            traceback.print_exc()
            # Volvemos a lanzar para que destroy() lo capture como excepción global.
            raise
    
class RoutineViewSet(viewsets.ModelViewSet):
    queryset = Routine.objects.all()
    serializer_class = RoutineSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    def get_queryset(self):
        # Solo rutinas del trainer logueado
        return Routine.objects.filter(trainer=self.request.user)

    @action(detail=False, methods=['get'], url_path='for-client/(?P<client_id>[^/.]+)')
    def for_client(self, request, client_id=None):
        qs = self.get_queryset().filter(client_id=client_id)
        return Response(self.get_serializer(qs, many=True).data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_routine(request):
    # El cliente ve su última rutina creada
    rut = request.user.routines.order_by('-created_at').first()
    if not rut:
        return Response({}, status=204)
    return Response(RoutineSerializer(rut).data)



class TrainerListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint para que clientes listéis los trainers disponibles.
    """
    queryset = User.objects.filter(groups__name='Trainer')
    serializer_class = SimpleUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    

User = get_user_model()

def register_client(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Método no permitido")

    data = json.loads(request.body)
    pref_id  = data.get('pref_id')
    username = data.get('username')
    email    = data.get('email')
    password = data.get('password')

    # 1) Verificar pago aprobado
    try:
        payment = Payment.objects.get(preference_id=pref_id, status='approved')
    except Payment.DoesNotExist:
        return HttpResponseBadRequest("Pago no aprobado o inválido")

    # 2) Crear usuario
    user = User.objects.create_user(username=username, email=email, password=password)
    # 3) Vincular usuario al pago
    payment.user = user
    payment.save()

    return JsonResponse({ "ok": True })


class IsTrainerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # solo trainers pueden crear/editar
        if view.action in ['create','update','partial_update','destroy']:
            return request.user and request.user.groups.filter(name='Trainer').exists()
        return True

class RunningPlanViewSet(viewsets.ModelViewSet):
    queryset = RunningPlan.objects.all()
    serializer_class = RunningPlanSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainerOrReadOnly]

    def get_queryset(self):
        # trainers ven todos, clientes solo los suyos
        user = self.request.user
        if user.groups.filter(name='Trainer').exists():
            return RunningPlan.objects.all()
        return RunningPlan.objects.filter(client=user)
    


    