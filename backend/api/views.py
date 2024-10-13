from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response.set_cookie("csrftoken", token)
    return response
