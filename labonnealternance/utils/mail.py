import logging, mandrill, re

from django.conf import settings

EMAIL_REGEX = re.compile(r'/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')

def is_email(email):
    return EMAIL_REGEX.match(email)


def send_mail(message):
    if settings.EMAIL_ACTIVATED:
        mandrill_client = mandrill.Mandrill(settings.MANDRILL_API_KEY)

        email = message.get('mail')
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