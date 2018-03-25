import { createStore } from 'redux';

import { FILTERS_REDUCERS } from './filters.reducers';

export const FILTERS_STORE = createStore(FILTERS_REDUCERS);