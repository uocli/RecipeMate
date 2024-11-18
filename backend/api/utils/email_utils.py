from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_email(subject, to_email, template_name, context):
    html_content = render_to_string(f"emails/{template_name}.html", context)
    text_content = render_to_string(f"emails/{template_name}.txt", context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()
