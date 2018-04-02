from django.urls import path

from . import views

urlpatterns = [
    path('send_form', views.send_form),
]