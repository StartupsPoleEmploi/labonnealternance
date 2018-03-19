import { createStore } from 'redux';

import { CURRENT_LOCATION_REDUCER } from './current_location.reducer';

export const CURRENT_LOCATION_STORE = createStore(CURRENT_LOCATION_REDUCER);
