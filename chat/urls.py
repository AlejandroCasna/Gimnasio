# chat/urls.py
from rest_framework.routers import DefaultRouter
from .views import ChatThreadViewSet, MessageViewSet

router = DefaultRouter()
router.register('threads',  ChatThreadViewSet, basename='chat-threads')
router.register('messages', MessageViewSet,    basename='chat-messages')

urlpatterns = router.urls
