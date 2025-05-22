# subscriptions/urls.py  ← opcional, ya NO lo incluyes desde backend/urls.py

from django.urls import path
from .views import me, my_routine

urlpatterns = [
    path('me/',         me,         name='user-me'),
    path('my-routine/', my_routine, name='my-routine'),
]
