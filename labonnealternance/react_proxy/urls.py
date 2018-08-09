from django.urls import path, re_path
from django.views.generic import RedirectView

from . import views


urlpatterns = [
    path('robots.txt', views.get_robots),
    path('sitemap.xml', views.get_sitemap),
    path('googlea04ab2b847e8e66f.html', views.get_google_site_verification),
    path('stats', RedirectView.as_view(url='https://datastudio.google.com/open/1v-Sim2qMlFSMn4n9JJWaMk8PIONvM757')),
    re_path(r'^', views.ReactProxyAppView.as_view()),
]
