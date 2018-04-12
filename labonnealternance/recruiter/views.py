import json, logging

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError
from django.views.decorators.csrf import csrf_protect

from labonnealternance.utils.mail import is_email, send_mail

@csrf_protect
def send_form(request):
    """
    Send form values to La Bonne Boite for traitment
    """
    data = json.loads(request.body.decode('utf-8'))

    email = data.get('email', None)
    if not email:
        return HttpResponseBadRequest('<h1>Bad request : no email given</h1>')
    elif not is_email(email):
        return HttpResponseBadRequest('<h1>Bad request : malformed email</h1>')

    form = data.get('form', None)
    if not form:
        return HttpResponseBadRequest('<h1>Bad request : no form given</h1>')

    html_message = """
        <img style='float:right' src='https://labonnealternance.pole-emploi.fr/static/img/logo/logo-lba.png' alt='' />
        <br/><br/>
        Un email a été envoyé par le formulaire de contact de la Bonne Alternance :<br/>
        - Action : {}<br/>
        - Siret : {},<br/>
        - Prénom : {},<br/>
        - Nom : {}, <br/>
        - E-mail : {},<br/>
        - Tél. : {},<br/>
        - Commentaire : {}<br/><br/>

        Cordialement,<br/>
        La Bonne Alternance<br/><br/><br/>""".format(
            form.get('action'),
            form.get('siret'),
            form.get('firstName'),
            form.get('lastName'),
            email,
            form.get('phone'),
            form.get('comment')
    )

    # Send e-mail
    try:
        send_mail({
            'subject' : "[LBA] Prise de contact",
            'email': 'labonneboite@pole-emploi.fr',
            'html': html_message
        })
    except Exception:
        return HttpResponseServerError('Error while send email')

    return HttpResponse('SUCCESSFULL')