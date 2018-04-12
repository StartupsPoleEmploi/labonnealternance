import json, logging

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError
from django.views.decorators.csrf import csrf_protect

from labonnealternance.utils.mail import is_email, send_mail
from labonnealternance.api.labonneboite import lbb_client
from labonnealternance.api.common.siret_validator import validate_siret

COMPANY_TEMPLATE = """
    <hr />
    <div>
        <h2>{}</h2>
        <p>{}</p>
        <ul style='list-style' >
            <li>Adresse :
                <ul>
                    <li>{}</li>
                    <li>{}</li>
                </ul>
            </li>
            <li>Contact :
                <ul>
                    <li>Téléphone : {}</li>
                    <li>E-mail : {}</li>
                </ul>
            </li>
        </ul>
    </div>
"""

@csrf_protect
def send_favorites(request):
    """
    Get company's sirets that user put as favorite and send it to the given e-mail
    """
    data = json.loads(request.body.decode('utf-8'))

    # Validate datas
    email = data.get('email', None)
    if not email:
        return HttpResponseBadRequest('<h1>Bad request : no email given</h1>')
    elif not is_email(email):
        return HttpResponseBadRequest('<h1>Bad request : malformed email</h1>')

    favorites = data.get('favorites')
    if not data.get('favorites'):
        return HttpResponseBadRequest('<h1>Bad request : no favorites given</h1>')

    # Create companies HTML
    html_company = ''
    for siret in data.get('favorites'):
        if not validate_siret(siret):
            continue

        try:
            response = lbb_client.get_company(siret)
        except:
            continue
        else:
            company = json.loads(response.read().decode('utf-8'))
            address = company.get('address', {})

            html_company = "{} {}".format(
                html_company,
                COMPANY_TEMPLATE.format(
                    company.get('name', 'Nom inconnu'),
                    company.get('naf_text', ''),
                    "{} {}".format(address.get('street_number', ''), address.get('street_name', '')),
                    "{} {}".format(address.get('zipcode', ''),address.get('city', '')),
                    company.get('phone','Non renseigné'),
                    company.get('email','Non renseigné'),
                )
            )


    # Create HTML global message
    html_message = """
        <img style='float:right' src='https://labonnealternance.pole-emploi.fr/static/img/logo/logo-lba.png' alt='' />
        <br/>
        <div><p>Bonjour, <br/>Vous trouverez ci-dessous la liste de vos favoris :</p></div>
        {}<hr><br/><br/>
        Cordialement,<br/>
        La Bonne Alternance<br/><br/><br/>
        <em>Cet e-mail a été généré automatiquement, merci de ne pas y répondre<em>
    """.format(html_company)

    # Send e-mail
    try:
        send_mail({
            'subject' : '[LBA] Export de vos favoris',
            'email': email,
            'html': html_message
        })
    except Exception:
        return HttpResponseServerError('Error while send email')


    return HttpResponse('SUCCESSFULL')