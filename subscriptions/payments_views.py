# subscriptions/payments_views.py
import json
import mercadopago
import logging
from django.conf import settings
from django.http import HttpResponseBadRequest, JsonResponse, Http404
from .models import Payment
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

logger = logging.getLogger(__name__)

@csrf_exempt
def create_preference(request):
    data       = json.loads(request.body)
    amount     = data['amount']
    product_id = data['product_id']

    mp = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    preference_data = {
        "items": [{
            "title":      product_id,
            "quantity":   1,
            "unit_price": float(amount),
        }],
        # <-- INCLUIMOS PAYER para saltarnos login
        "payer": {
            "email":          "test_user_1234@test.com",
            "name":           "Usuario",
            "surname":        "Prueba",
            "phone": {
                "area_code": "11",
                "number":    "12345678"
            },
            "identification": {
                "type":   "DNI",
                "number": "20123456"
            }
        },
        "back_urls": {
            "success": f"{settings.FRONTEND_URL}/registro-cliente?pref_id={{id}}",
            "failure": f"{settings.FRONTEND_URL}/pago-fallido",
            "pending": f"{settings.FRONTEND_URL}/pago-pendiente",
        },
        "auto_return":      "approved",
        "notification_url": f"{settings.FRONTEND_URL}/api/mp-webhook/",
    }

    pref_response = mp.preference().create(preference_data)
    resp         = pref_response["response"]
    pref_id      = resp.get("id")
    init_point   = resp.get("init_point")
    if not (pref_id and init_point):
        return HttpResponseBadRequest("Error creando preference con MP")

    Payment.objects.create(preference_id=pref_id, amount=amount)
    return JsonResponse({"id": pref_id, "init_point": init_point})

@csrf_exempt
def mp_webhook(request):
    # MercadoPago envía en GET o POST el topic y el id de preferencia
    data = request.GET or request.POST
    pref_id = data.get('preference_id') or data.get('data.id')
    # Consulta estado real
    mp = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    payment_info = mp.payment().get(pref_id)
    status = payment_info["response"]["status"]

    try:
        payment = Payment.objects.get(preference_id=pref_id)
        if status == 'approved':
            payment.status = 'approved'
            payment.save()
        elif status in ('pending','in_process'):
            payment.status = 'pending'
            payment.save()
        else:
            payment.status = 'failure'
            payment.save()
    except Payment.DoesNotExist:
        pass

    return HttpResponse(status=200)


def payment_status(request, pref_id):
    try:
        payment = Payment.objects.get(preference_id=pref_id)
    except Payment.DoesNotExist:
        raise Http404("Pago no encontrado")

    return JsonResponse({ "status": payment.status })