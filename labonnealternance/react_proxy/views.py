import json, logging, os, urllib
from urllib.error import HTTPError

from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from labonnealternance.api.labonneboite import lbb_client


URLS_TO_TITLE = {
    '/recherche': 'Trouvez votre contrat d\'alternance | La Bonne Alternance',
    '/acces-recruteur': 'Accès recruteurs | La Bonne Alternance',
    '/conditions-generales-utilisation': 'Conditions Générales d\'utilisation | La Bonne Alternance',
    '/qui-sommes-nous': 'Qui sommes-nous ? | La Bonne Alternance',
    '/faq': 'Questions fréquentes | La Bonne Alternance',
}
DEFAULT_TITLE = 'Le site des entreprises qui recrutent en alternance | La Bonne Alternance'
COMPANY_DETAILS_TITLE = 'Offres probables d\'alternance société {}'

RESULTS_PAGE_TITLE = 'Offres d\'alternance probables en {} - {} ({}) | La Bonne Alternance'
RESULTS_PAGE_TITLE_NO_CITY = 'Offres d\'alternance probables en {} | La Bonne Alternance'


class NoCompanyFound(Exception):
    pass


class ReactProxyAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `npm run build`).
    """
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        # Compute page title
        path = urllib.parse.unquote_plus(request.get_full_path())

        if not path.endswith('.css') and not path.endswith('.js') and not path.endswith('.ico'):
            params = {
                'title': self.compute_page_title(path),
                'canonical': self.compute_page_canonical(request),
            }

            # Render all index.html only in home page
            if path == '/':
                params.update({ 'render_complete_home': True })

            # Company details
            if path.startswith("/details-entreprises/"):
                params = self.get_company_details_as_param(path, params)

            # Search
            elif path.startswith('/entreprises/'):
                params = self.get_companies_as_params(path, params)

            return render(request, 'index.html', params)

        # Generic case
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'), encoding='utf-8') as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            """
            This URL is only used when you have built the production
            version of the app. Visit http://localhost:3000/ instead, or
            run `npm run build` to test the production version.
            """
            logging.fatal('Production build not found')

            return HttpResponse("Not available", status=501)


    def compute_page_title(self, path):
        """
        When a page is access direclty and for SEO purpose, we need to compute the title server-side
        """
        title = URLS_TO_TITLE.get(path, DEFAULT_TITLE)

        if path.startswith("/entreprises/commune/"):
            title = DEFAULT_TITLE
        elif path.startswith("/entreprises/"):
            title = self.compute_results_search_title(path)

        return title

    def compute_page_canonical(self, request):
        scheme = 'https' if request.is_secure() else 'http'
        host = request.get_host()
        path = request.get_full_path()

        canonical = '{}://{}{}'.format(
            scheme,
            host,
            path,
        )
        return canonical[0:canonical.find('?')]

    # Company details
    """
    Add company details in params object for rendring in template
    """
    def get_company_details_as_param(self, path, params):
        try:
            title, company_data = self.compute_details_company_data(path)
        except NoCompanyFound:
            pass
        else:
            if title and company_data:
                params.update({
                    'title': title,
                    'store': {
                        'name': '__companyDetails',
                        'data': json.dumps(company_data)
                    }
                })
        return params

    def compute_details_company_data(self, path):
        """
        Compute URL when we display the details of a company
        Exemple : https://labonnealternance.pole-emploi.fr/details-entreprises/81903933000025
        """
        url_without_query_string = path[:path.find('?')] if '?' in path else path
        url_params = url_without_query_string.split('/')

        siret = url_params[-1]
        response = None
        try:
            response = lbb_client.get_company(siret)
        except Exception:
            raise NoCompanyFound("No company found with siret : {}".format(siret))

        if response:
            company_data = json.loads(response.read().decode('utf-8'))
            return COMPANY_DETAILS_TITLE.format(company_data.get('name', '')), company_data


    def compute_results_search_title(self, path):
        # Get search term (and city-slug if possible)
        url_params = self.extract_params(path)
        search_term = url_params[-1]

        if len(url_params) == 5:
            # When we have 5 parts, the URL looks like : /entreprises/:jobSlugs/:citySlug/:term  #Note : url_params[0] == '')
            city_slug = url_params[len(url_params) - 2]
            city, zipcode = self.extract_city_slug(city_slug)

            # Clean slug
            city = city.replace('-', ' ')
            city = city.title().strip() # Capitalize and trim

            return RESULTS_PAGE_TITLE.format(search_term, city, zipcode)

        # No city-slug
        return RESULTS_PAGE_TITLE_NO_CITY.format(search_term)

    # Company search
    def get_companies_as_params(self, path, params):
        url_params = self.extract_params(path)

        # Get slug
        try:
            romes_data = self.get_rome_codes(url_params[2])
        except HTTPError:
            # Error => No need to go further
            return params

        longitude = None
        latitude = None

        # In case, we got romes-slug/city-slug
        if len(url_params) == 5:
            try:
                response = lbb_client.get_city_slug_details(url_params[-2])
            except HTTPError:
                # Error => No need to go further
                return params

            city_data = json.loads(response.read().decode('utf-8'))
            longitude = city_data['city']['longitude']
            latitude = city_data['city']['latitude']

        # In case we got romes-slugs/longitude/latitude
        elif len(url_params) == 6:
            longitude = url_params[-3]
            latitude = url_params[-2]
        else:
            # Too much or not enough parameters, no need to go further
            return params

        # Get companies
        rome_codes_str = ','.join([rome['rome_code'] for rome in romes_data])
        try:
            response = lbb_client.get_hidden_market_companies(longitude, latitude, rome_codes_str)
        except HTTPError:
            # Error => No need to go further
            return params

        # This step is needed to handle " and ' characters
        companies_data_temp = json.loads(response.read().decode('utf-8'))

        # Keep only (in order to reduce JSON size)
        filter_results = [
            {
                'name': company.get('name'),
                'siret': company.get('siret'),
                'naf': company.get('naf'),
                'naf_text': company.get('naf_text'),
                'lon': company.get('lon'),
                'lat': company.get('lat'),
                'city': company.get('city'),
                'distance': company.get('distance'),
                'matched_rome_code': company.get('matched_rome_code'),
                'flag_alternance': company.get('flag_alternance')
            } for company in companies_data_temp.get('companies')
        ]
        companies_data_temp.update({ 'companies': filter_results })

        companies_data = json.dumps(companies_data_temp)

        params.update({
            'store': {
                'name': '__companies',
                'data': companies_data
            },
            'longitude': format_as_float(longitude),
            'latitude': format_as_float(latitude),
            'jobs': romes_data
        })

        return params


    def get_rome_codes(self, romes_slug):
        response = lbb_client.get_job_slug_details(romes_slug)
        return json.loads(response.read().decode('utf-8'))


    def extract_params(self, path):
        url_without_query_string = path[:path.find('?')] if '?' in path else path
        return url_without_query_string.split('/')


    def extract_city_slug(self, city_slug):
        last_dash_index = city_slug.rfind('-')
        city = city_slug[:last_dash_index]
        zipcode = city_slug[last_dash_index+1:]
        return city, zipcode

def format_as_float(float_value):
    return str(float_value).replace(',','.')

def get_sitemap(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'static', 'sitemap.xml'), encoding='utf-8') as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'text/xml; charset=utf-8'
            return response
    except FileNotFoundError:
        logging.error('No sitemap.xml')
        return HttpResponse("Not found", status=404)


def get_google_site_verification(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'static', 'googlea04ab2b847e8e66f.html'), encoding='utf-8') as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        logging.error('No googlea04ab2b847e8e66f.html')
        return HttpResponse("Not found", status=404)


def get_robots(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'static', 'robots.txt'), encoding='utf-8') as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'text/plain; charset=utf-8'
            return response
    except FileNotFoundError:
        logging.error('No robots.txt')

        return HttpResponse("Not found", status=404)
