import { createStore } from 'redux';

import { VIEWS_REDUCERS } from './views.reducers';

export const VIEWS_STORE = createStore(VIEWS_REDUCERS);