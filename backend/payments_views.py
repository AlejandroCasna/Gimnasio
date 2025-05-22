# backend/subscriptions/views.py (al final o en payments_views.py)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .payments import crear_preferencia

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generar_pago(request):
    """
    Recibe { plan: "1_semana" } en el body y devuelve {"checkout_url": ...}
    """
    plan = request.data.get("plan")
    if plan not in crear_preferencia.__globals__["PLANOS"]:
        return Response({"error": "Plan inválido"}, status=400)
    url = crear_preferencia(plan, request.user.id)
    return Response({"checkout_url": url})
