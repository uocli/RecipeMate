from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.views import APIView


class CSRFTokenView(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve the CSRF token for the request
        csrf_token = get_token(request)
        return Response({"csrfToken": csrf_token})
