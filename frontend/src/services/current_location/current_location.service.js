import { constants } from '../../constants';

import { NotificationService } from '../notification/notification.service';

import { CURRENT_LOCATION_STORE } from './current_location.store';
import { CURRENT_LOCATION_ACTIONS } from './current_location.reducer';

import { formatString } from '../helpers';

export class CurrentLocationService {

    constructor() {
        this.notificationService = new NotificationService();
    }

    getCurrentLocation(longitude, latitude) {
        if (isNaN(longitude) || isNaN(latitude)) {
            this.notificationService.createError('Erreur lors de la récupération de ta position');
            return;
        }

        let url = formatString(constants.API_ADRESSE_URL, { longitude, latitude });
        fetch(url)
            .then(response => {
                if (response.status === 200) return response.json();
                this.notificationService.createError('Erreur lors de la récupération de ta position');
                return;
            }).then(response => {
                if (!response) return;
                if (response.features === undefined) {
                    this.notificationService.createError('Erreur lors de la récupération de ta position');
                }

                let addressData = response.features[0].properties;
                CURRENT_LOCATION_STORE.dispatch({
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