import collections, json, re
from urllib.error import HTTPError

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, HttpResponseNotFound, JsonResponse

from config.settings import WIDGET_PAGE_SIZE
from . import lbb_client
from labonnealternance.api.common import siret_validator
from .custom_search_jobs import CustomSearchJob


CUSTOM_SEARCH_JOB_RESULTS = CustomSearchJob()
DISTANCE_DEFAULT = 50


def add_cors(response):
    response["Access-Control-Allow-Origin"] =  "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return response

def suggest_romes(request):
    """
    Auto-complete for a giving job label
    """
    text = request.GET.get('term', None)
    widget_domain_name = request.GET.get('widget-name', None)

    if not text:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    if not CUSTOM_SEARCH_JOB_RESULTS.load:
        CUSTOM_SEARCH_JOB_RESULTS.load_csv()

    # Manual search mapping
    results = CUSTOM_SEARCH_JOB_RESULTS.get_entry(text)
    if results:
        # Note: by default, only dict are handle by JsonResponse
        # So we set safe=False to handle an array
        lba_response = JsonResponse(results, safe=False)
        return add_cors(lba_response) if widget_domain_name else lba_response


    # Remove some cursus words
    escape_words = ['alternance', 'bts', 'licence', 'master', 'brevet', 'cap', 'cqp', 'titre', 'cqp', 'bp', 'professionnelle']
    for word in escape_words:
        escape = re.compile(re.escape(word), re.IGNORECASE)
        text = escape.sub('', text)

    lbb_response = lbb_client.autocomplete_job(text)
    lba_response = HttpResponse(lbb_response.read())

    return add_cors(lba_response) if widget_domain_name else lba_response


def suggest_cities(request):
    """
    Auto-complete for a giving location
    """
    text = request.GET.get('term', None)
    widget_domain_name = request.GET.get('widget-name', None)

    if not text:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    try:
        lbb_response = lbb_client.autocomplete_city(text)
    except HTTPError:
        return HttpResponseNotFound()

    lba_response = HttpResponse(lbb_response.read())

    return add_cors(lba_response) if widget_domain_name else lba_response


def company_details(request):
    siret = request.GET.get('siret', None)
    if not siret or not siret_validator.validate_siret(siret):
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    try:
        response = lbb_client.get_company(siret)
    except HTTPError:
        return HttpResponseNotFound()
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
    # We have a token but an invalid one, no need to go further
    widget_domain_name = request.GET.get('widget-name', None)
    use_widget_user = True if widget_domain_name else False

    # Required values
    Fetcher = collections.namedtuple('Fetcher', "romes longitude latitude")
    fetcher = Fetcher(request.GET.get('romes'), request.GET.get('longitude'), request.GET.get('latitude'))
    if not all(fetcher):
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    # Optional value : page
    page = 1 if widget_domain_name else request.GET.get('page', 1)
    try:
        page = int(page)
    except ValueError:
        page = 1

    if page < 1:
        page = 1

    # Optional value : pageSize
    try:
        page_size = int(request.GET.get('pageSize', lbb_client.PAGE_SIZE))
        page_size = WIDGET_PAGE_SIZE if widget_domain_name else page_size
    except ValueError:
        page_size = None

    if page_size < 0:
        page_size = None

    # Optional value : distance
    distance = request.GET.get('distance', DISTANCE_DEFAULT)
    try:
        distance = int(distance)
    except ValueError:
        distance = 1


    try:
        response = lbb_client.get_companies(fetcher.longitude, fetcher.latitude, fetcher.romes, page, distance, page_size, use_widget_user)
    except HTTPError:
        return HttpResponseServerError('<h1>Error when proceeded request</h1>', 501)

    response = HttpResponse(response.read())

    return add_cors(response) if widget_domain_name else response

