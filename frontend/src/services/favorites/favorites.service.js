import ReactGA from 'react-ga';

import { FAVORITES_ACTIONS } from './favorites.reducers';
import { FAVORITES_STORE } from './favorites.store';
import { Favorite } from './favorite';

import { CompanyDetailsService } from '../company_details/company_details.service';
import { NotificationService } from '../notification/notification.service';
import { constants } from '../../constants';
import { getCookie } from '../helpers';

const FAVORITES_STORAGE_KEY = 'FAVORITES';
const EMAIL_STORAGE_KEY = 'EMAIL';
const MAX_FAVORITES = 50; // Avoid too much favorites

export class FavoritesService {

    constructor() {
        this.notificationService = new NotificationService();

        // Save favorites to local storage when favorites change
        FAVORITES_STORE.subscribe(() => {
            this.saveFavoritesToLocalStorage();
        });
    }

    addFavorite(company) {
        // Check if we already have reach the favorites limit
        let favorites = FAVORITES_STORE.getState();
        if (favorites.size >= MAX_FAVORITES) {
            this.notificationService.createError('Désolé, vous ne pouvez pas sauvegardé plus de ' + MAX_FAVORITES + ' favoris.');
        }

        // Get company details from La Bonne Boite
        let companyService = new CompanyDetailsService();
        let response = companyService.getCompanyDetailsAsPromise(company.siret);

        response.then(companyData => {
            FAVORITES_STORE.dispatch({
                type: FAVORITES_ACTIONS.ADD_FAVORITE,
                data: {
                    company: {
                        siret: companyData.siret,
                        label: companyData.name,
                        longitude: companyData.lon,
                        latitude: companyData.lat,
                        nafText: companyData.naf_text,
                        officeName: companyData.raison_sociale,
                        address: companyData.address,
                        email: companyData.email,
                        phone: companyData.phone,
                        website: companyData.website
                    }
                }
            });
        });

    }

    removeFavorite(siret) {
        FAVORITES_STORE.dispatch({
            type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
            data: { siret }
        });
    }

    getFavoritesFromLocalStorage() {
        let favorites = [];

        let rawValues = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!rawValues) return undefined;

        // Recreate favorites
        try {
            let values = JSON.parse(rawValues);

            values.forEach(data => {
                favorites.push(
                    new Favorite(
                        data.siret,
                        data.label,
                        data.longitude,
                        data.latitude,
                        data.nafText,
                        data.address,
                        data.email,
                        data.phone,
                        data.website
                    )
                );

            });
        } catch (e) {
            console.error(e);
        }

        // Save favorites
        FAVORITES_STORE.dispatch({
            type: FAVORITES_ACTIONS.ADD_ALL_FAVORITES,
            data: { favorites }
        });

        return favorites;
    }

    sendFavorites(email, favoriteSiret) {
        // Save email to localStorage
        localStorage.setItem(EMAIL_STORAGE_KEY, email);

        return new Promise((resolve, reject) => {
            fetch(constants.SEND_FAVORITES_URL, {
                method: "POST",
                headers: {
                    'Accept':'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    favorites : favoriteSiret,
                })
            }).then(response => {
                if(response.status === 200) {
                    ReactGA.event({ category: 'Favorites', action: 'Send favorites by email' });

                    resolve();
                    return;
                }

                // Send exception to Sentry (for further analysis)
                window.Raven.captureException(new Error("Error when exporting favorites : " + response.status + " " + response.statusText));

                reject();
            })
        });

    }

    getEmailFromLocalStorage() {
        let email = localStorage.getItem(EMAIL_STORAGE_KEY);
        return email || '';
    }

    saveFavoritesToLocalStorage() {
        // Transform the favorite map to an array
        let favorites = [];
        FAVORITES_STORE.getState().forEach((favorite, siret) => favorites.push(favorite));

        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
}