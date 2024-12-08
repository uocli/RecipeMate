from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .password_forgot_view import PasswordForgotView


class PasswordChangeView(APIView):
    def get(self, request, format=None):
        return Response(
            {
                "success": False,
                "message": "Method not allowed.",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def post(self, request, format=None):
        user = request.user
        data = request._request.POST.copy()
        data["email"] = user.email
        new_request = Request(request._request)
        new_request._full_data = data
        response = PasswordForgotView(ignore_captcha=True).post(new_request, format)
        return response
