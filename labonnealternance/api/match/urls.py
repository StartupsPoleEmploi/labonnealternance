from django.urls import path

from . import views

urlpatterns =[
    path('get_soft_skills', views.get_soft_skills),
]