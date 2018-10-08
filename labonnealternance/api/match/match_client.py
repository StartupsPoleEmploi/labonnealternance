import datetime, requests

from labonnealternance.api.common.singleton import Singleton
from labonnealternance.api.common.client_base import ClientBase
from config.settings import MATCH_VIA_SOFT_SKILLS_EXTRA_SCOPES

MATCH_API_URL = 'https://api.emploi-store.fr/partenaire/matchviasoftskills/v1/professions/job_skills?code={}'
ESD_SCOPES = ['api_matchviasoftskillsv1'] + MATCH_VIA_SOFT_SKILLS_EXTRA_SCOPES

class SoftSkillsNotFound(Exception):
    pass

class MatchClient(Singleton, ClientBase):
    token = None
    token_expiration_date = None

    def get_soft_skills(self, rome):
        if not self.token or not super().is_token_valid(self.token_expiration_date):
            self.token, self.token_expiration_date = super().get_token(ESD_SCOPES)

        # Call to Emploi Store Developpeur
        headers = {
            'Authorization': 'Bearer ' + self.token,
            'Content-Disposition': 'form-data; name="code"',
        }

        url = MATCH_API_URL.format(rome)
        response = requests.post(url, data=rome, headers=headers, verify=False)

        if response.status_code == 400:
            raise SoftSkillsNotFound('No soft skills associated to the rome :{}'.format(rome))

        return response.text