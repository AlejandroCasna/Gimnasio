# subscriptions/urls.py  ← opcional, ya NO lo incluyes desde backend/urls.py

from django.urls import path
from subscriptions import running_views
from . import payments_views
from .views import me, my_routine, register_client

urlpatterns = [
    path('me/',         me,         name='user-me'),
    path('my-routine/', my_routine, name='my-routine'),
    path('crear_preference/', payments_views.create_preference, name='crear_preference'),
    path('mp-webhook/', payments_views.mp_webhook, name='mp_webhook'),
    path('payment-status/<str:pref_id>/', payments_views.payment_status, name='payment_status'),
    path('register-client/', register_client, name='register_client'),
    path('trainer/running-plans/',           running_views.RunningPlanListCreate.as_view(), name='runningplan-list'),
    path('trainer/running-plans/<int:pk>/',  running_views.RunningPlanDetail.as_view(),     name='runningplan-detail'),
    
    
    ]
