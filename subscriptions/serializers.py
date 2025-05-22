# subscriptions/serializers.py

from django.contrib.auth.models import User,Group
from rest_framework import serializers
from .models import Profile, Exercise, Routine, RoutineExercise


class ClientSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)
    tipo = serializers.ChoiceField(
        write_only=True,
        choices=[
            ('distancia', 'A distancia'),
            ('presencial', 'Personalizado presencial'),
            ('grupal', 'Clases grupales'),
        ],
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'phone', 'tipo'
        ]

    def create(self, validated_data):
        phone = validated_data.pop('phone')
        tipo = validated_data.pop('tipo')
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False,
        )
        user.set_unusable_password()
        user.save()
        Profile.objects.create(user=user, phone=phone, tipo=tipo)
        clients_group, _ = Group.objects.get_or_create(name='Clients')
        user.groups.add(clients_group)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField()
    weight = serializers.FloatField()
    age = serializers.IntegerField()
    height = serializers.FloatField()

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone', 'weight', 'age', 'height',
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'email' in user_data:
            instance.user.email = user_data['email']
            instance.user.save()
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        return instance


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'video_url']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise_id = serializers.PrimaryKeyRelatedField(
        source='exercise',
        queryset=Exercise.objects.all(),
        write_only=True,
    )
    # en lectura devuelvo el nested completo:
    exercise = ExerciseSerializer(read_only=True)

    class Meta:
        model = RoutineExercise
        fields = [
            'id',
            'exercise',    # read-only nested
            'exercise_id', # write-only PK
            'day_of_week',
            'reps_range',
            'order',
        ]
        
class RoutineSerializer(serializers.ModelSerializer):
    # items anidados
    items = RoutineExerciseSerializer(many=True)
    # recibimos el client en el payload
    client = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='Clients'),
        write_only=True
    )

    class Meta:
        model = Routine
        fields = ['id', 'client', 'name', 'week_number', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        client = validated_data.pop('client')
        routine = Routine.objects.create(client=client, **validated_data)
        for it in items_data:
            # it ya trae exercise como PK
            RoutineExercise.objects.create(routine=routine, **it)
        return routine

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        instance.name = validated_data.get('name', instance.name)
        instance.week_number = validated_data.get('week_number', instance.week_number)
        instance.save()
        # borramos y re-creamos
        instance.items.all().delete()
        for it in items_data:
            RoutineExercise.objects.create(routine=instance, **it)
        return instance

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username' ,'first_name', 'last_name']