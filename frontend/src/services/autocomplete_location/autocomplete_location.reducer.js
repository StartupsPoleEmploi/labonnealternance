import { AutocompleteLocation } from './autocomplete_location';

export const AUTOCOMPLETE_LOCATION_ACTIONS = {
    CLEAR_SUGGESTIONS: 'CLEAR_SUGGESTIONS',
    SET_SUGGESTIONS: 'SET_SUGGESTIONS'
};

let initialState = [];
export const AUTOCOMPLETE_LOCATION_REDUCER = (state = initialState, action) => {

    switch (action.type) {

        case AUTOCOMPLETE_LOCATION_ACTIONS.SET_SUGGESTIONS: {
            let suggestions = [];
            action.data.forEach(city => {
                suggestions.push(
                    new AutocompleteLocation(city.city, city.zipcode, city.label, city.longitude, city.latitude)
                );
            });
            return suggestions;
        }

        case AUTOCOMPLETE_LOCATION_ACTIONS.CLEAR_SUGGESTIONS:
            return [];

        default:
            return state;
    }
};