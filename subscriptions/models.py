

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    tipo = models.CharField(max_length=20)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    age    = models.PositiveIntegerField(null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    def __str__(self):
        return f"{self.user.username} Profile"
    

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


class Exercise(models.Model):
    name      = models.CharField(max_length=200, unique=True)
    video_url = models.URLField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Routine(models.Model):
    client      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routines')
    name        = models.CharField(max_length=200)
    week_number = models.PositiveIntegerField(default=1)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Semana {self.week_number})"

class RoutineExercise(models.Model):
    MON, TUE, WED, THU, FRI, SAT, SUN = range(1,8)
    DAY_CHOICES = [
        (MON, 'Lunes'), (TUE, 'Martes'), (WED, 'Miércoles'),
        (THU, 'Jueves'), (FRI, 'Viernes'),
        (SAT, 'Sábado'), (SUN, 'Domingo'),
    ]

    routine      = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='items')
    exercise     = models.ForeignKey(Exercise, on_delete=models.PROTECT)
    day_of_week  = models.IntegerField(choices=DAY_CHOICES)
    reps_range   = models.CharField(max_length=50, help_text="Ej: 8-12")
    order        = models.PositiveIntegerField(help_text="Orden dentro del día")

    class Meta:
        ordering = ['routine__week_number', 'day_of_week', 'order']

class Payment(models.Model):
    preference_id = models.CharField(max_length=200, unique=True)
    status        = models.CharField(
        max_length=20,
        choices=[
            ('pending',  'Pending'),
            ('approved', 'Approved'),
            ('failure',  'Failure'),
        ],
        default='pending'
    )
    amount     = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    # Nuevo campo: vincula el pago al usuario una vez que se registre
    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='payments'
    )

    def __str__(self):
        return f"{self.preference_id} ({self.status})"
    

class RunningPlan(models.Model):
    trainer     = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='running_plans'           # planes creados por el trainer
    )
    client      = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='running_plans_received'  # planes que recibe el cliente
    )
    name        = models.CharField(max_length=200)
    week_number = models.PositiveIntegerField(default=1)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Semana {self.week_number}) para {self.client.username}"

class RunningItem(models.Model):
    MON, TUE, WED, THU, FRI, SAT, SUN = range(1, 8)
    DAY_CHOICES = [
        (MON, 'Lunes'), (TUE, 'Martes'), (WED, 'Miércoles'),
        (THU, 'Jueves'), (FRI, 'Viernes'),
        (SAT, 'Sábado'), (SUN, 'Domingo'),
    ]

    plan           = models.ForeignKey(
        RunningPlan,
        on_delete=models.CASCADE,
        related_name='items'
    )
    day_of_week    = models.IntegerField(choices=DAY_CHOICES)
    distance_value = models.DecimalField(max_digits=6, decimal_places=2)
    distance_unit  = models.CharField(max_length=2, choices=[('km','km'),('m','m')])
    work_time      = models.DurationField(help_text="Formato HH:MM:SS")
    series         = models.PositiveIntegerField()
    rest_time      = models.DurationField(help_text="Formato HH:MM:SS")
    training_type  = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['plan__week_number', 'day_of_week']

    def __str__(self):
        return f"{self.plan.name} – {self.get_day_of_week_display()}"