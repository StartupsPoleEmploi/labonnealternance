import logging, mandrill, re

from django.conf import settings

def is_email(email):
    # Use of Django EmailValidator : https://stackoverflow.com/questions/3217682/checking-validity-of-email-in-django-python
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def send_mail(message):
    if settings.EMAIL_ACTIVATED:
        mandrill_client = mandrill.Mandrill(settings.MANDRILL_API_KEY)

        email = message.get('email')
        if settings.MANDRILL_REDIRECT_ALL_EMAIL_TO:
            email = settings.MANDRILL_REDIRECT_ALL_EMAIL_TO

        message = {
            'subject': message.get('subject'),
            'to': [{'email': email }],
            'from_name': settings.MANDRILL_FROM_NAME,
            'from_email': settings.MANDRILL_FROM_EMAIL,
            'html': message.get('html')
        }

        try:
            mandrill_client.messages.send(message)
        except Exception as e:
            logging.error("Cannot send email {} - {}".format(str(e), message))
            raise e