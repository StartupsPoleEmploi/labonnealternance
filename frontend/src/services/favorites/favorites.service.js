import { FAVORITES_ACTIONS } from './favorites.reducers';
import store from '../store';
import { Favorite } from './favorite';

import { CompanyDetailsService } from '../company_details/company_details.service';
import { NotificationService } from '../notification/notification.service';
import { constants } from '../../constants';
import { getCookie } from '../helpers';
import { GoogleAnalyticsService } from '../google_analytics.service';

const FAVORITES_STORAGE_KEY = 'FAVORITES';
const EMAIL_STORAGE_KEY = 'EMAIL';
const MAX_FAVORITES = 50; // Avoid too much favorites

class FavoritesServiceFactory {

    constructor() {
        // Save favorites to local storage when favorites change
        store.subscribe(() => {
            this.saveFavoritesToLocalStorage();
        });
    }

    addFavorite(company) {
        // Check if we already have reach the favorites limit
        let favorites = store.getState().favorites;
        if (favorites.size >= MAX_FAVORITES) {
            NotificationService.createError('Désolé, vous ne pouvez pas sauvegardé plus de ' + MAX_FAVORITES + ' favoris.');
        }

        // Get company details from La Bonne Boite
        let response = CompanyDetailsService.getCompanyDetailsFromLBB(company.siret);

        response.then(companyData => {
            store.dispatch({
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
        store.dispatch({
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
        store.dispatch({
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
                    GoogleAnalyticsService.sendEvent({ category: 'Favorites', action: 'Send favorites by email' });

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
        store.getState().favorites.forEach((favorite, siret) => favorites.push(favorite));

        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
}


// Export as singleton
const favoritesService = new FavoritesServiceFactory();
Object.freeze(favoritesService);
export { favoritesService as FavoritesService };