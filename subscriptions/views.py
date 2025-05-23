# backend/subscriptions/views.py

from django.contrib.auth.models import User, Group
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Profile, Exercise, Routine 
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ModelSerializer
import json
from .models import RunningPlan
from .serializers import RunningPlanSerializer
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Payment

from .serializers import (
    ClientSerializer,
    ProfileSerializer,
    ExerciseSerializer,
    RoutineSerializer,
    SimpleUserSerializer,
    
)

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

        # grupo Clients
        grp, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(grp)

        # envía email de set-password
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        url = request.build_absolute_uri(
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )
        send_mail(
            'Configura tu contraseña – El Bajo Entrena',
            f'¡Bienvenido! Para crear tu contraseña: {url}',
            'no-reply@elbajoentrena.com',
            [user.email],
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
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

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
    


    