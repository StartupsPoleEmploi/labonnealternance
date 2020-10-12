from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views import View

import json

from .triggers_matcha import get_triggers_matcha

def get_triggers(request):
    """
    Retrieve a list of triggers to be executed on the client side
    """
    location = request.GET.get('location')
    romes = request.GET.getlist('romes')
    triggers = get_triggers_matcha(location, romes)
    if(triggers):
        return HttpResponse(json.dumps([triggers]))
    return HttpResponse(json.dumps([]))

