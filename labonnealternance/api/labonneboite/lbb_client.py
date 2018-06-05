
import datetime, hmac, hashlib, logging, os, urllib
from urllib.error import HTTPError

from config.settings import LBB_URL, LBB_API_KEY, LBB_USE_BETA_FLAG

logger = logging.getLogger(__name__)

API_USER = 'labonnealternance'

PAGE_SIZE = 100

LBB_COMPANY_DETAILS_URL = '{}/api/v1/office/{}/details?{}'
LBB_COMPANIES_URL = '{}/api/v1/company/?{}'
LBB_JOB_SLUG_DETAILS_URL = '{}/job_slug_details?job-slug={}'
LBB_CITY_SLUG_DETAILS_URL = '{}/city_slug_details?city-slug={}'
LBB_CITY_SLUG_FROM_CITY_CODE_URL = '{}/city_code_details?city-code={}'
LBB_ROME_URL = '{}/suggest_job_labels?term={}'
LBB_CITY_URL = '{}/suggest_locations?term={}'



def make_timestamp():
    """
    Create the API request's timestamp
    """
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    return timestamp


def make_signature(args, timestamp, user=API_USER):
    """
    Create an hash code (with MD5) for the API's request

    Args:
        args: request arguments
        timestamp: timestamp of the request, created with make_timestamp()
    """
    args['timestamp'] = timestamp
    ordered_arg_string = get_ordered_argument_string(args)

    signature = hmac.new(bytearray(LBB_API_KEY, 'utf-8'), bytearray(ordered_arg_string, 'utf-8'), hashlib.md5).hexdigest()
    return signature


def get_ordered_argument_string(args):
    """
    Sort and urlencode the given dict
    """
    args_copy = dict(args)
    if 'signature' in args_copy:
        del args_copy['signature']

    ordered_args = []
    for arg in sorted(args_copy):
        ordered_args.append(
            (arg, args_copy[arg])
        )

    return urllib.parse.urlencode(ordered_args)


def autocomplete_job(text):
    """ Get jobs matching the given text by calling LaBonneBoite """
    url = LBB_ROME_URL.format(LBB_URL, urllib.parse.quote(text))
    return urllib.request.urlopen(url)

def autocomplete_city(text):
    """ Get cities matching the given text by calling LaBonneBoite """
    url = LBB_CITY_URL.format(LBB_URL, urllib.parse.quote(text))
    return urllib.request.urlopen(url)


def get_company(siret):
    """
    Get details of the company associated to the given siret by calling LaBonneBoite API.
    """
    params = {
        'user': API_USER,
    }

    timestamp = make_timestamp()
    signature = make_signature(params, timestamp)
    params['timestamp'] = timestamp
    params['signature'] = signature

    url = LBB_COMPANY_DETAILS_URL.format(LBB_URL, siret, urllib.parse.urlencode(params))
    return urllib.request.urlopen(url)


def get_companies(longitude, latitude, romes, page=1, distance=50):
    """
    Calling LaBonneBoite API to get all the companies matches the given arguments.

    More informations at :
    https://www.emploi-store-dev.fr/portail-developpeur-cms/home/catalogue-des-api/documentation-des-api/api-la-bonne-boite-v1/rechercher-des-entreprises.html
    """
    params = {
        'longitude': longitude,
        'latitude': latitude,
        'rome_codes': romes,
        'user': API_USER,
        'distance': distance,
        'page': page,
        'contract': 'alternance',
        'page_size': PAGE_SIZE
    }


    timestamp = make_timestamp()
    signature = make_signature(params, timestamp)
    params['timestamp'] = timestamp
    params['signature'] = signature

    url = LBB_COMPANIES_URL.format(LBB_URL, urllib.parse.urlencode(params))

    try:
        response = urllib.request.urlopen(url)
    except HTTPError as e:
        logger.error('Error when calling URL : {} - Exception: {}'.format(url, e))
        raise(e)

    return response

def get_job_slug_details(job_slug):
    url = LBB_JOB_SLUG_DETAILS_URL.format(LBB_URL, job_slug)

    try:
        response = urllib.request.urlopen(url)
    except HTTPError as e:
        logger.error('Error when calling URL : {} - Exception: {}'.format(url, e))
        raise(e)

    return response

def get_city_slug_from_city_code(city_code):
    url = LBB_CITY_SLUG_FROM_CITY_CODE_URL.format(LBB_URL, city_code)

    try:
        response = urllib.request.urlopen(url)
    except HTTPError as e:
        logger.error('Error when calling URL : {} - Exception: {}'.format(url, e))
        raise(e)

    return response


def get_city_slug_details(city_slug):
    url = LBB_CITY_SLUG_DETAILS_URL.format(LBB_URL, city_slug)

    try:
        response = urllib.request.urlopen(url)
    except HTTPError as e:
        logger.error('Error when calling URL : {} - Exception: {}'.format(url, e))
        raise(e)

    return response
