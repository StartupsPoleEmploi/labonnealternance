import datetime, json, os, requests, urllib

from config.settings import ESD_CLIENT_ID, ESD_CLIENT_SECRET


ACCESS_TOKEN_URL = "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=%2Fpartenaire"

APPLICATION_SCOPE = [ 'application_{}'.format(ESD_CLIENT_ID) ]

class ClientBase(object):

    def join_scopes(self, scopes):
        inline_scopes = ' '.join(scopes)
        return inline_scopes

    def get_token(self, scopes):
        """
        Example call:
            POST /connexion/oauth2/access_token?realm=%2Fpartenaire
            Content-Type: application/x-www-form-urlencoded

            grant_type=client_credentials
            &client_id=[identifiant client]
            &client_secret=[clé secrète]
            &scope=application_[identifiant client]%20api_labonneboitev1

        Documentation:
            https://www.emploi-store-dev.fr/portail-developpeur-cms/home/catalogue-des-api/documentation-des-api/utiliser-les-api/client-credentials-grant/etape-1---generer-un-access-toke.html

        """
        # Format request data
        data = {
            'grant_type': 'client_credentials',
            'client_id': ESD_CLIENT_ID,
            'client_secret': ESD_CLIENT_SECRET,
            'scope': ' '.join(APPLICATION_SCOPE + scopes),
        }

        try:
            r = requests.post(ACCESS_TOKEN_URL, data=data, headers={'Content-Type':'application/x-www-form-urlencoded'})
            response = r.json()
            return response['access_token'], self.compute_expire_date(response['expires_in'])
        except Exception as e:
            pass


    def compute_expire_date(self, expires_in):
        """
        Compute the expiration date of a token

        Args :
            - expires_in : expire duration (in seconds)
        """
        return datetime.datetime.now() + datetime.timedelta(seconds=expires_in)

    def is_token_valid(self, token_expiration_date):
        if not token_expiration_date:
            return False
        return token_expiration_date > datetime.datetime.now()
