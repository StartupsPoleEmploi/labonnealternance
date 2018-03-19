from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound

from .match_client import SoftSkillsNotFound, MatchClient

def get_soft_skills(request):
    """
    Get soft skills via Match via Soft Skills
    See : https://www.emploi-store-dev.fr/portail-developpeur-cms/home/catalogue-des-api/documentation-des-api/api-matchviasoftskills-v1.html
    """
    rome = request.GET.get('rome', None)
    if not rome:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    # TODO : cache the answer

    # Retrieve company info from Emploi Store Developpeurs
    match_client = MatchClient()

    try:
        datas = match_client.get_soft_skills(rome)
    except SoftSkillsNotFound as e:
        return HttpResponseNotFound(e.message)

    return HttpResponse(datas)