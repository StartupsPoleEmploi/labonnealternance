import datetime, requests

from labonnealternance.api.common.singleton import Singleton
from labonnealternance.api.common.client_base import ClientBase


ENTREPRISES_API_URL = 'https://api.emploi-store.fr/partenaire/pagesentreprises/v1/pagesentreprises/{}'
ESD_SCOPES = ['api_pagesentreprisesv1', 'pagesentreprises']

class CompanyNotFound(Exception):
    pass

class EntreprisesClient(Singleton, ClientBase):
    token = None
    token_expiration_date = None

    def get_company_details(self, siret):
        if not self.token or not super().is_token_valid(self.token_expiration_date):
            self.token, self.token_expiration_date = super().get_token(ESD_SCOPES)

        # Call to Emploi Store Developpeur
        headers = { 'Authorization': 'Bearer ' + self.token }

        url = ENTREPRISES_API_URL.format(siret)

        response = requests.get(url, headers=headers)

        if response.status_code == 400:
            raise CompanyNotFound('Company with siret {} not found'.format(siret))

        return response.text

