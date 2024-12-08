import requests
from backend import settings


def verify_captcha(captcha_token):
    response = requests.post(
        settings.TURNSTILE_VERIFY_URL,
        data={
            "secret": settings.TURNSTILE_SECRET_KEY,
            "response": captcha_token,
        },
    )
    result = response.json()
    return result.get("success", False)
