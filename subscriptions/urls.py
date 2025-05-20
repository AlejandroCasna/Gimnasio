# subscriptions/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainerListViewSet, 
    me, 
    TrainerViewSet, 
    ExerciseViewSet, 
    RoutineViewSet, 
    my_routine,
)
from .auth_views import ActivatePasswordResetConfirmView

router = DefaultRouter()
router.register('trainer',    TrainerViewSet,    basename='trainer')
router.register('exercises',  ExerciseViewSet)
router.register('routines',   RoutineViewSet)
router.register('trainers',   TrainerListViewSet, basename='trainers')

urlpatterns = [
    path('me/',         me,         name='user-me'),
    path('my-routine/', my_routine, name='my-routine'),
    path('', include(router.urls)),
    path(
      'accounts/reset/<uidb64>/<token>/',
      ActivatePasswordResetConfirmView.as_view(),
      name='password_reset_confirm'
    ),
]
