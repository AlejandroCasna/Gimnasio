# backend/payments.py

import mercadopago
from django.conf import settings

mp = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

PLANOS = {
    "1_semana": {"title": "1 vez a la semana", "unit_price": 25000},
    "2_semanas": {"title": "2 veces a la semana", "unit_price": 32000},
    "3_semanas": {"title": "3 veces a la semana", "unit_price": 35000},
    "4_semanas": {"title": "4 veces a la semana", "unit_price": 38000},
    "libre":     {"title": "Libre",               "unit_price": 42000},
}

def crear_preferencia(plan_key: str, user_id: int) -> str:
    plan = PLANOS[plan_key]
    preference_data = {
        "items": [{
            "title":      plan["title"],
            "quantity":   1,
            "unit_price": float(plan["unit_price"]),
        }],
        "payer": {"id": str(user_id)},
        "back_urls": {
            "success": settings.FRONTEND_URL + "/pagos/exito",
            "failure": settings.FRONTEND_URL + "/pagos/error",
            "pending": settings.FRONTEND_URL + "/pagos/pendiente",
        },
        "auto_return": "approved",
    }
    resp = mp.preference().create(preference_data)
    return resp["response"]["init_point"]
