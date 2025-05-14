# backend/subscriptions/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainerViewSet , ProfileViewSet , me


router = DefaultRouter()
router.register('trainer', TrainerViewSet, basename='trainer')
router.register('profile/me', ProfileViewSet, basename='profile-me')

urlpatterns = [
    path('me/', me, name='user-me'),
    path('', include(router.urls)),
    
]
