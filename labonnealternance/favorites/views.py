import logging

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_protect

from labonnealternance.utils.mail import is_email, send_mail

@csrf_protect
def send_favorites(request):
    """
    Get company's sirets that user put as favorite and send it to the given e-mail
    """

    email = request.POST.get('email', None)
    if not email:
        return HttpResponseBadRequest('<h1>Bad request : no email given</h1>')
    elif not is_email(email):
        return HttpResponseBadRequest('<h1>Bad request : malformed email</h1>')


    if not request.POST.get('favorites'):
        return HttpResponseBadRequest('<h1>Bad request : no favorites given</h1>')
    import ipdb; ipdb.set_trace()


    return HttpResponse('SUCCESSFULL')