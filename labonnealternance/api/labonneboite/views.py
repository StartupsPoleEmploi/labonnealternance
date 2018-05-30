import collections, re
from urllib.error import HTTPError

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError

from . import lbb_client
from labonnealternance.api.common import siret_validator


DISTANCE_DEFAULT = 50

def suggest_romes(request):
    """
    Auto-complete for a giving job label
    """
    text = request.GET.get('term', None)
    if not text:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    # Remove some cursus words
    escape_words = ['alternance', 'bts', 'licence', 'master', 'brevet', 'cap']
    for word in escape_words:
        escape = re.compile(re.escape(word), re.IGNORECASE)
        text = escape.sub('', text)

    response = lbb_client.autocomplete_job(text)
    return HttpResponse(response.read())


def suggest_cities(request):
    """
    Auto-complete for a giving location
    """
    text = request.GET.get('term', None)
    if not text:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    response = lbb_client.autocomplete_city(text)
    return HttpResponse(response.read())


def company_details(request):
    siret = request.GET.get('siret', None)
    if not siret or not siret_validator.validate_siret(siret):
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    response = lbb_client.get_company(siret)
    return HttpResponse(response.read())


def get_city_slug_values(request):
    city_slug = request.GET.get('city-slug', None)
    if not city_slug:
        return HttpResponseBadRequest('<h1>Bad request : no city_slug given</h1>')

    response = lbb_client.get_city_slug_details(city_slug)
    return HttpResponse(response.read())


def get_job_slug_values(request):
    job_slug = request.GET.get('job-slug', None)
    if not job_slug:
        return HttpResponseBadRequest('<h1>Bad request : no job_slug given</h1>')

    response = lbb_client.get_job_slug_details(job_slug)
    return HttpResponse(response.read())


def get_city_slug_from_city_code(request):
    city_code = request.GET.get('city-code', None)
    if not city_code:
        return HttpResponseBadRequest('<h1>Bad request : no city-code given</h1>')

    response = lbb_client.get_city_slug_from_city_code(city_code)
    return HttpResponse(response.read())


def get_companies(request):
    # Required values
    Fetcher = collections.namedtuple('Fetcher', "romes longitude latitude")
    fetcher = Fetcher(request.GET.get('romes'), request.GET.get('longitude'), request.GET.get('latitude'))
    if not all(fetcher):
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    # Optional value : page
    page = request.GET.get('page', 1)
    try:
        page = int(page)
    except ValueError:
        page = 1

    if page < 1:
        page = 1

    # Optional value : distance
    distance = request.GET.get('distance', DISTANCE_DEFAULT)
    try:
        distance = int(distance)
    except ValueError:
        distance = 1


    try:
        response = lbb_client.get_companies(fetcher.longitude, fetcher.latitude, fetcher.romes, page, distance)
    except HTTPError:
        return HttpResponseServerError('<h1>Error when proceeded request</h1>', 501)

    return HttpResponse(response.read())