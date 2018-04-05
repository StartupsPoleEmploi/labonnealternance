from django.urls import path

from . import views

urlpatterns =[
    path('send_by_email', views.send_favorites),
]