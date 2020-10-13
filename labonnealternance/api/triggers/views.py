from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views import View

import json

from .triggers import get_triggers_matcha

def get_triggers(request):
    """
    Retrieve a list of triggers to be executed on the client side
    @param django request on the triggers/ API route
    @see frontend/src/services/triggers.js

    TODO: pass more generic GET params when more triggers are needed
    """
    # Get the matcha triggers
    triggers = get_triggers_matcha(request.GET)
    # Return the triggers to be executed on the front end
    if(triggers):
        return HttpResponse(json.dumps([triggers]))
    return HttpResponse(json.dumps([]))

