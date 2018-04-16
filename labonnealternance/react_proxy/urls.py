from django.urls import path, re_path
from . import views


urlpatterns = [
    path('robots.txt', views.get_robots),
    path('sitemap.xml', views.get_sitemap),
    path('googlea04ab2b847e8e66f.html', views.get_google_site_verification),
    re_path(r'^', views.ReactProxyAppView.as_view()),
]