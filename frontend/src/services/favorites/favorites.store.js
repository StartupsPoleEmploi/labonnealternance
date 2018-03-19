import { createStore } from 'redux';

import { FAVORITES_REDUCERS } from './favorites.reducers';

export const FAVORITES_STORE = createStore(FAVORITES_REDUCERS);