from django.contrib.auth.models import User
from rest_framework import serializers
from .models      import ChatThread, Message

class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source='author.username',
        read_only=True
    )

    class Meta:
        model  = Message
        fields = [
            'id',
            'thread',             # id del hilo
            'author',             # sigue presente en la respuesta
            'author_username',    # nombre de usuario en la respuesta
            'text',
            'timestamp',
        ]
        read_only_fields = [
            'author',             # <— ahora no es obligatorio en el POST
            'author_username',
            'timestamp',
        ]

class ChatThreadSerializer(serializers.ModelSerializer):
    client           = serializers.PrimaryKeyRelatedField(read_only=True)
    trainer          = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(groups__name='Trainer'))
    trainer_username = serializers.CharField(source='trainer.username', read_only=True)
    last_message     = serializers.SerializerMethodField()

    class Meta:
        model  = ChatThread
        fields = ['id', 'client', 'trainer', 'trainer_username', 'last_message']

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(msg).data if msg else None