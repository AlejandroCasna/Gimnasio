# backend/subscriptions/serializers.py
from email.headerregistry import Group
from django.contrib.auth.models import User
from rest_framework import serializers
# si tienes un modelo Profile para phone/tipo
from .models import Profile  

class ClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone    = serializers.CharField(write_only=True)
    tipo     = serializers.ChoiceField(
                  write_only=True,
                  choices=[('distancia','A distancia'),
                           ('presencial','Personalizado presencial'),
                           ('grupal','Clases grupales')],
                )

    class Meta:
        model = User
        # incluimos phone y tipo en campos de entrada, aunque no existen en User
        fields = ['id','username','password','first_name','last_name','email','phone','tipo']

    def create(self, validated_data):
        # extraemos los campos no-User
        phone = validated_data.pop('phone')
        tipo  = validated_data.pop('tipo')
        password = validated_data.pop('password')

        # creamos User
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email',''),
            first_name=validated_data.get('first_name',''),
            last_name=validated_data.get('last_name',''),
            is_active=False,  # sigue tu lógica
        )
        user.set_password(password)
        user.save()

        # creamos profile si existe
        Profile.objects.create(user=user, phone=phone, tipo=tipo)

        # lo metemos en grupo Clients
        clients_group, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(clients_group)

        return user
