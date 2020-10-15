"""labonnealternance URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('api/labonneboite/', include("labonnealternance.api.labonneboite.urls")),
    path('api/match/', include("labonnealternance.api.match.urls")),
    path('api/entreprises/', include("labonnealternance.api.entreprises.urls")),
    path('api/triggers/', include("labonnealternance.api.triggers.urls")),

    path('favorites/', include("labonnealternance.favorites.urls")),
    path('recruiter/', include("labonnealternance.recruiter.urls")),

    path('admin/', admin.site.urls),

    # React application / sitemap.xml / robots.txt / google-site-verification : must be last !
    re_path(r'^', include("labonnealternance.react_proxy.urls")),
]
