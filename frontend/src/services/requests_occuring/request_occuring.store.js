import { createStore } from 'redux';

import { REQUEST_OCCURING_REDUCERS } from './request_occuring.reducers';

export const REQUEST_OCCURING_STORE = createStore(REQUEST_OCCURING_REDUCERS);