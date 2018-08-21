import { constants } from '../../constants';

import { NotificationService } from '../notification/notification.service';

import { AUTOCOMPLETE_LOCATION_STORE } from './autocomplete_location.store';
import { AUTOCOMPLETE_LOCATION_ACTIONS } from './autocomplete_location.reducer';

import { cleanTerm } from '../helpers';

class AutocompleteLocationServiceFactory {

    getCities(term) {
        fetch(constants.SUGGEST_CITY_URL + cleanTerm(term))
            .then(response => {
                if (response.status === 200) return response.json();

                NotificationService.createError('Erreur lors de la récupération des villes');
                AUTOCOMPLETE_LOCATION_STORE.dispatch({ type: AUTOCOMPLETE_LOCATION_ACTIONS.CLEAR_SUGGESTIONS });
            })
            .then(citiesObjects => {
                if (!citiesObjects) return;

                // Create
                AUTOCOMPLETE_LOCATION_STORE.dispatch({
                    type: AUTOCOMPLETE_LOCATION_ACTIONS.SET_SUGGESTIONS,
                    data: citiesObjects
                });
            });
    }
}

// Export as singleton
const autocompleteLocationService = new AutocompleteLocationServiceFactory();
Object.freeze(autocompleteLocationService);
export { autocompleteLocationService as AutocompleteLocationService };