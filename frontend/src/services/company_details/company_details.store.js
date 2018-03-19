import { createStore } from 'redux';

import { COMPANY_DETAILS_REDUCER } from './company_details.reducer';

export const COMPANY_DETAILS_STORE = createStore(COMPANY_DETAILS_REDUCER);