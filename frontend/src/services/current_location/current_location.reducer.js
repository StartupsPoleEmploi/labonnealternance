import { CurrentLocation } from './current_location';

export const CURRENT_LOCATION_ACTIONS = {
    SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION'
};

export const CURRENT_LOCATION_REDUCER = (state = null, action) => {

    switch (action.type) {

        case CURRENT_LOCATION_ACTIONS.SET_CURRENT_LOCATION:
            return new CurrentLocation(
                action.data.address,
                action.data.zipcode,
                action.data.longitude,
                action.data.latitude
            );

        default:
            return state;
    }
};