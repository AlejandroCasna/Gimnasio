
from django.db import models
from django.contrib.auth.models import User

class ChatThread(models.Model):
    """
    Un hilo de chat entre un cliente y su entrenador.
    """
    client  = models.ForeignKey(User, related_name='client_threads', on_delete=models.CASCADE)
    trainer = models.ForeignKey(User, related_name='trainer_threads', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('client', 'trainer')

    def __str__(self):
        return f"{self.client.username} ↔ {self.trainer.username}"

class Message(models.Model):
    """
    Un mensaje dentro de un hilo.
    """
    thread    = models.ForeignKey(ChatThread, related_name='messages', on_delete=models.CASCADE)
    author    = models.ForeignKey(User, on_delete=models.CASCADE)
    text      = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.author.username}: {self.text[:20]}"
