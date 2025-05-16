

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from subscriptions.views import ExerciseViewSet, RoutineViewSet, my_routine

router = DefaultRouter()
router.register(r'trainer/exercises', ExerciseViewSet, basename='trainer-exercises')
router.register(r'trainer/routines', RoutineViewSet, basename='trainer-routines')



urlpatterns = [
    path("admin/", admin.site.urls),
     # JWT auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('accounts/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('accounts/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    # Nuestro endpoint de trainer
    path('api/', include('subscriptions.urls')),
    path('api/', include(router.urls)),
    path('api/me/routine/', my_routine, name='my-routine'),

]

