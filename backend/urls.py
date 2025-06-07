# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import  TokenRefreshView
from rest_framework.routers import DefaultRouter
from subscriptions.auth_views import CustomTokenObtainPairView

# Importa tus views

from subscriptions.views import (
    RunningPlanViewSet,
    me,
    my_routine,
    TrainerListViewSet,
    TrainerViewSet,
    ExerciseViewSet,
    RoutineViewSet      as SubRoutineViewSet,
)
from chat.views import ChatThreadViewSet, MessageViewSet

router = DefaultRouter()

# — Usuarios & perfil —
router.register(r'trainers',    TrainerListViewSet,   basename='trainers')     # listado público de trainers (con username)
router.register(r'trainer',     TrainerViewSet,       basename='trainer')      # gestión de clientes/rutinas (solo trainer)
router.register(r'routines',    SubRoutineViewSet,    basename='routines')     # rutinas (solo trainer)
router.register(r'exercises', ExerciseViewSet, basename='exercises')    # ejercicios (solo trainer)
router.register(r'running-plans', RunningPlanViewSet, basename='runningplan')
router.register(r'trainer/running-plans', RunningPlanViewSet, basename='runningplans')


# — Chat —
router.register(r'chat/threads',  ChatThreadViewSet,   basename='chat-threads')
router.register(r'chat/messages', MessageViewSet,      basename='chat-messages')

urlpatterns = [
    path('admin/', admin.site.urls),

    # — JWT —
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),    name='token_refresh'),

    # — Password reset (built-in Django) —
    path('api/accounts/password_reset/',           auth_views.PasswordResetView.as_view(),     
                                          name='password_reset'),
    path('api/accounts/reset/<uidb64>/<token>/',   auth_views.PasswordResetConfirmView.as_view(),
                                          name='password_reset_confirm'),
    path('api/accounts/reset/done/',               auth_views.PasswordResetCompleteView.as_view(),
                                          name='password_reset_complete'),

    

    # — “Soy yo” y mi rutina de cliente —
    path('api/me/',         me,         name='user-me'),
    path('api/my-routine/', my_routine, name='my-routine'),
    path('api/', include('subscriptions.urls')),
    path('api/', include('django.contrib.auth.urls')),
    
    # — TODO el resto del router DRF bajo /api/ —
    path('api/', include(router.urls)),
]
