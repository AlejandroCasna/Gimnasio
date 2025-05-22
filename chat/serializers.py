from django.contrib.auth.models import User
from rest_framework import serializers
from .models      import ChatThread, Message

class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Message
        fields = ['id', 'thread', 'text', 'timestamp', 'author_username']
        read_only_fields = ['timestamp', 'author_username']

class ChatThreadSerializer(serializers.ModelSerializer):
    client_username  = serializers.SerializerMethodField()
    trainer_username = serializers.SerializerMethodField()
    last_message     = serializers.SerializerMethodField()

    class Meta:
        model  = ChatThread
        fields = [
            'id',
            'client',
            'trainer',
            'client_username',
            'trainer_username',
            'last_message',
        ]

    def get_client_username(self, obj):
        return obj.client.username

    def get_trainer_username(self, obj):
        return obj.trainer.username if obj.trainer else None

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(msg).data if msg else None
    
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']