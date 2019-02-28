import { constants } from '../../constants';

import { NotificationService } from '../notification/notification.service';

import store from '../store';
import { CURRENT_LOCATION_ACTIONS } from './current_location.reducer';

import { formatString } from '../helpers';

class CurrentLocationServiceFactory {

    getCurrentLocation(longitude, latitude) {
        if (isNaN(longitude) || isNaN(latitude)) {
            NotificationService.createError('Erreur lors de la récupération de ta position');
            return;
        }

        let url = formatString(constants.API_ADRESSE_URL, { longitude, latitude });
        fetch(url)
            .then(response => {
                if (response.status === 200) return response.json();
                NotificationService.createError('Erreur lors de la récupération de ta position');
                return;
            }).then(response => {
                if (!response) return;
                if (response.features === undefined) {
                    NotificationService.createError('Erreur lors de la récupération de ta position');
                    return;
                }

                let addressData = response.features[0].properties;
                store.dispatch({
                    type: CURRENT_LOCATION_ACTIONS.SET_CURRENT_LOCATION,
                    data: {
                        address: addressData.label,
                        zipcode: addressData.citycode,
                        longitude,
                        latitude
                    }
                });
            });

    }
}

// Export as singleton
const currentLocationService = new CurrentLocationServiceFactory();
Object.freeze(currentLocationService);
export { currentLocationService as CurrentLocationService };