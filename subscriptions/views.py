# backend/subscriptions/views.py

from django.contrib.auth.models import User, Group
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions, viewsets, status , mixins
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .serializers import ClientSerializer , ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Profile


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    

    if request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
    else:
        serializer = ProfileSerializer(profile)
        data = serializer.data

    # Añadimos aquí la lista de grupos
    data['groups'] = [g.name for g in request.user.groups.all()]
    return Response(data)


class IsTrainer(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name='Trainer').exists()
        )

class TrainerViewSet(viewsets.GenericViewSet):
    # 1) atribuimos queryset para get_object en detail actions
    queryset = User.objects.filter(groups__name='Clients')
    # serializer por defecto para list/create
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

    # 2) cambiamos de serializer según la acción
    def get_serializer_class(self):
        if self.action in ('profile', 'update_profile'):
            return ProfileSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'], url_path='clients')
    def list_clients(self, request):
        # lista ya filtrada por queryset
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'put'], url_path='profile')
    def profile(self, request, pk=None):
        """
        GET  /api/trainer/{pk}/profile/   → devuelve el Profile de ese cliente
        PUT  /api/trainer/{pk}/profile/   → actualiza los campos de Profile
        """
        # 1) Recupera (o crea si no existiera) el Profile del cliente
        from .models import Profile
        profile, _ = Profile.objects.get_or_create(user_id=pk)

        # 2) Si es PUT, actualiza
        if request.method == 'PUT':
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 3) Si es GET, sólo devuelve
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'], url_path='profile')
    def update_profile(self, request, pk=None):
        user = self.get_object()
        profile = user.profile
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-client')
    def create_client(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # 1) Crea usuario sin contraseña
        user = User.objects.create(
            username   = data['username'],
            first_name = data['first_name'],
            last_name  = data['last_name'],
            email      = data['email'],
            is_active  = True  # Cliente activará tras crear su contraseña
        )
        user.set_unusable_password()
        user.save()

        # 2) Guarda el teléfono en el Profile asociado
        # (suponiendo que tienes un modelo Profile con relación OneToOne)
        user.profile.phone = data['phone']
        user.profile.save()

        # 3) Añádelo al grupo 'Clients'
        clients_group, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(clients_group)

        # 4) Envía email con enlace para establecer contraseña
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = request.build_absolute_uri(
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )
        send_mail(
            subject='Configura tu contraseña – El Bajo Entrena',
            message=f'¡Bienvenido! Para crear tu contraseña sigue este enlace:\n\n{reset_url}',
            from_email='no-reply@elbajoentrena.com',
            recipient_list=[user.email],
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='clients')
    def list_clients(self, request):
        """
        GET /api/trainer/clients/
        Devuelve todos los usuarios del grupo 'Clients',
        sin filtrar por is_active.
        """
        clients_group = Group.objects.get(name='Clients')
        clients = clients_group.user_set.all()
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    """ GET & PUT a /api/profile/me/ """
    serializer_class   = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Siempre trabajamos sobre el Profile del user autenticado
        return self.request.user.profile
