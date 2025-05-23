from rest_framework import generics, permissions
from .models import RunningPlan
from .serializers import RunningPlanSerializer

class RunningPlanListCreate(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class   = RunningPlanSerializer

    def get_queryset(self):
        # Solo los planes creados por el trainer logueado
        return RunningPlan.objects.filter(trainer=self.request.user)

    def perform_create(self, serializer):
        # Asigna automáticamente el trainer antes de guardar
        serializer.save(trainer=self.request.user)


class RunningPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class   = RunningPlanSerializer

    def get_queryset(self):
        return RunningPlan.objects.filter(trainer=self.request.user)
