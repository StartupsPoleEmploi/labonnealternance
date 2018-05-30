from django.urls import path

from . import views

urlpatterns =[
    path('suggest_jobs', views.suggest_romes),
    path('suggest_cities', views.suggest_cities),
    path('company_details', views.company_details),
    path('get_companies', views.get_companies),
    path('job_slug', views.get_job_slug_values),
    path('city_slug', views.get_city_slug_values),
    path('city_slug_from_city_code', views.get_city_slug_from_city_code),
]