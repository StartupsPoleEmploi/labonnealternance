from django.urls import path, re_path
from . import views


urlpatterns = [
    path('robots.txt', views.get_robots),
    path('sitemap.xml', views.get_sitemap),
    re_path(r'^', views.ReactProxyAppView.as_view()),
]