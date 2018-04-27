import json
import logging
import os

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

RESULTS_PAGE_TITLE = 'Offres d\'alternance probables en {} - {} ({})'
RESULTS_PAGE_TITLE_NO_CITY = 'Offres d\'alternance probables en {}'


class ReactProxyAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `npm run build`).
    """
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        # Compute page title
        path = request.get_full_path()
        if not path.endswith('.css') and not path.endswith('.js'):
            return render(request, 'index.html', {
                'title': self.compute_page_title(path),
            })

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

        if path.startswith("/details-entreprises/"):
            title = self.compute_details_company_title(path)
        elif path.startswith("/entreprises/"):
            title = self.compute_results_search_title(path)

        return title


    def compute_details_company_title(self, path):
        """
        Compute URL when we display the details of a company
        Exemple : https://labonnealternance.pole-emploi.fr/details-entreprises/81903933000025
        """
        url_without_query_string = path[:path.find('?')] if '?' in path else path
        url_params = url_without_query_string.split('/')

        siret = url_params[-1]
        try:
            response = lbb_client.get_company(siret)
        except Exception:
            pass

        if response:
            company_data = json.loads(response.read().decode('utf-8'))
            return COMPANY_DETAILS_TITLE.format(company_data.get('name', ''))


    def compute_results_search_title(self, path):
        url_without_query_string = path[:path.find('?')] if '?' in path else path
        url_params = url_without_query_string.split('/')

        # Get search term (and city-slug if possible)
        search_term = url_params[-1]

        if len(url_params) == 5:
            # When we have 5 parts, the URL looks like : /entreprises/:jobSlugs/:citySlug/:term  #Note : url_params[0] == '')
            city_slug = url_params[len(url_params) - 2]
            city, zipcode = self.extract_city_slug(city_slug)

            return RESULTS_PAGE_TITLE.format(search_term, city, zipcode)

        # No city-slug
        return RESULTS_PAGE_TITLE_NO_CITY.format(search_term)


    def extract_city_slug(self, city_slug):
        last_dash_index = city_slug.rfind('-')
        city_raw = city_slug[:last_dash_index]
        zipcode = city_slug[last_dash_index+1:]

        # Clean slug
        city = city_raw.replace('-', ' ')
        city = city.title().strip() # Capitalize and trim

        return city, zipcode

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
