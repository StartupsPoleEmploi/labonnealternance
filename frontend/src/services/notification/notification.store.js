import { createStore } from 'redux';

import { NOTIFICATION_REDUCERS } from './notification.reducers';

export const NOTIFICATION_STORE = createStore(NOTIFICATION_REDUCERS);