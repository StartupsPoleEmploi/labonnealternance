import { createStore } from 'redux';

import { VISITED_SIRETS_REDUCERS } from './visited_sirets.reducers';

export const VISITED_SIRETS_STORE = createStore(VISITED_SIRETS_REDUCERS);