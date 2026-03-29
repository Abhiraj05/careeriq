from django.core.mail import send_mail
from django.contrib import messages

def send_email(request, distributer_email, customer_email, message, mail_sub, html_message=None):
    try:
        send_mail(
            mail_sub,
            message,
            distributer_email,
            [customer_email],
            fail_silently=False,
            html_message=html_message
        )
    except:
        messages.error(request, "email not sent!")