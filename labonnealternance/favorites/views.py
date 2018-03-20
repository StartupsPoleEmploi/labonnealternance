import logging

from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

import mandrill

def send_favorites(request):
    """
    Get company's sirets that user put as favorite and send it to the given e-mail
    """

    return HttpResponse('SUCCESSFULL')