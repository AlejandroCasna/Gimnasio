# chat/views.py
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response


from .models import ChatThread, Message
from .serializers import ChatThreadSerializer, MessageSerializer


class ChatThreadViewSet(viewsets.ModelViewSet):
    queryset = ChatThread.objects.all()
    serializer_class = ChatThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatThread.objects.filter(Q(client=user) | Q(trainer=user))

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        thread = self.get_object()
        msgs = thread.messages.all()
        return Response(MessageSerializer(msgs, many=True).data)

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        # Si es trainer, payload debe traer "client"; si es cliente, "trainer"
        if user.groups.filter(name="Trainer").exists():
            client_id = data.get("client")
            # ¿Ya existe hilo?
            thread = ChatThread.objects.filter(
                client_id=client_id, trainer=user
            ).first()
        else:
            trainer_id = data.get("trainer")
            thread = ChatThread.objects.filter(
                trainer_id=trainer_id, client=user
            ).first()

        if thread:
            # Devolvemos el hilo existente
            serializer = self.get_serializer(thread)
            return Response(serializer.data)

        # Si no existía, delegamos a la implementación por defecto
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        if user.groups.filter(name="Trainer").exists():
            # el trainer es quien crea, así que fijamos trainer=user
            serializer.save(trainer=user)
        else:
            # el cliente crea, fijamos client=user
            serializer.save(client=user)



class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
