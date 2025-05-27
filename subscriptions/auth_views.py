# backend/subscriptions/auth_views.py

from django.contrib.auth.views import PasswordResetConfirmView
from django.urls import reverse_lazy
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ActivatePasswordResetConfirmView(PasswordResetConfirmView):
    """
    Igual que la genérica, pero tras fijar la contraseña activa al usuario.
    """
    success_url = reverse_lazy('login')  # o la ruta a la que quieras redirigir

    def form_valid(self, form):
        response = super().form_valid(form)
        user = form.user
        user.is_active = True
        user.save(update_fields=['is_active'])
        return response


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)
        token['groups'] = list(user.groups.values_list('name', flat=True))
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer