import logging, os

from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator

class ReactProxyAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `npm run build`).
    """
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
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


def get_sitemap(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'static', 'sitemap.xml'), encoding='utf-8') as f:
            return HttpResponse(f.read())
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
            return HttpResponse(f.read())
    except FileNotFoundError:
        logging.error('No robots.txt')

        return HttpResponse("Not found", status=404)