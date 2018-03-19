from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.views import View

from .entreprises_client import CompanyNotFound, EntreprisesClient

def get_details(request):
    """
    Retrieve company's details from the Emploi Store Dev (API entreprises)
    See : https://www.emploi-store-dev.fr/portail-developpeur-cms/home/catalogue-des-api/documentation-des-api/api-pages-entreprises-v1/consulter-une-page-entreprise.html
    """
    siret = request.GET.get('siret', None)
    if not siret:
        return HttpResponseBadRequest('<h1>Bad request</h1>')

    # Retrieve company info from Emploi Store Developpeurs
    entreprises_client = EntreprisesClient()

    try:
        datas = entreprises_client.get_company_details(siret)
    except CompanyNotFound as e:
        return HttpResponseNotFound(e.message)

    return HttpResponse(datas)
