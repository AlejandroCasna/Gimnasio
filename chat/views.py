# chat/views.py
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ChatThread, Message
from .serializers import ChatThreadSerializer, MessageSerializer


class ChatThreadViewSet(viewsets.ModelViewSet):
    queryset         = ChatThread.objects.all()
    serializer_class = ChatThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatThread.objects.filter(Q(client=user) | Q(trainer=user))

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        thread = self.get_object()
        msgs   = thread.messages.all()
        return Response(MessageSerializer(msgs, many=True).data)

    def perform_create(self, serializer):
        # Aquí fijamos client=request.user
        serializer.save(client=self.request.user)



class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
