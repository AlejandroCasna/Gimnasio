# backend/subscriptions/views.py

from django.contrib.auth.models import User, Group
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import ClientSerializer

class IsTrainer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name='Trainer').exists()
        )

class TrainerViewSet(viewsets.GenericViewSet):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrainer]

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
            is_active  = False  # Cliente activará tras crear su contraseña
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
