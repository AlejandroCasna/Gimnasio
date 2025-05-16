# backend/subscriptions/auth_views.py

from django.contrib.auth.views import PasswordResetConfirmView
from django.urls import reverse_lazy

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
