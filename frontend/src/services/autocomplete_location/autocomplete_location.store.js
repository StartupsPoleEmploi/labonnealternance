import { createStore } from 'redux';

import { AUTOCOMPLETE_LOCATION_REDUCER } from './autocomplete_location.reducer';

export const AUTOCOMPLETE_LOCATION_STORE = createStore(AUTOCOMPLETE_LOCATION_REDUCER);
