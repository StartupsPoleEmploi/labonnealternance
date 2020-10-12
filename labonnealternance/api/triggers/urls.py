from django.urls import path

from . import views

urlpatterns = [
    path('get_triggers', views.get_triggers),
]
