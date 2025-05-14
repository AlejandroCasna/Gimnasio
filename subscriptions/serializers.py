from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Profile   # <- importa tu modelo Profile




class ClientSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)
    tipo  = serializers.ChoiceField(
        write_only=True,
        choices=[
            ('distancia','A distancia'),
            ('presencial','Personalizado presencial'),
            ('grupal','Clases grupales'),
        ],
    )

    class Meta:
        model = User
        fields = [
            'id','username','first_name','last_name',
            'email','phone','tipo'
        ]

    def create(self, validated_data):
        phone = validated_data.pop('phone')
        tipo  = validated_data.pop('tipo')

        # 1) Creamos el User sin contraseña usable
        user = User(
            username   = validated_data['username'],
            email      = validated_data.get('email',''),
            first_name = validated_data.get('first_name',''),
            last_name  = validated_data.get('last_name',''),
            is_active  = False,
        )
        user.set_unusable_password()
        user.save()

        # 2) Creamos el Profile ligado al user
        Profile.objects.create(user=user, phone=phone, tipo=tipo)

        # 3) Lo metemos en el grupo Clients
        clients_group, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(clients_group)

        return user
    
    


class ProfileSerializer(serializers.ModelSerializer):
    # Campos “solo lectura” del User
    username   = serializers.CharField(source='user.username',   read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name  = serializers.CharField(source='user.last_name',  read_only=True)
    email      = serializers.EmailField   (source='user.email')

    # Campos editables de Profile
    phone  = serializers.CharField()
    weight = serializers.FloatField()
    age    = serializers.IntegerField()
    height = serializers.FloatField()

    class Meta:
        model  = Profile
        fields = [
            'username','first_name','last_name','email',
            'phone','weight','age','height',
        ]

    def update(self, instance, validated_data):
        # 1) Actualiza datos de User (solo email, pues lo demás es read_only)
        user_data = validated_data.pop('user', {})
        if 'email' in user_data:
            instance.user.email = user_data['email']
            instance.user.save()

        # 2) Actualiza campos de Profile
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance