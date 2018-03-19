import { createStore } from 'redux';

import { COMPANIES_REDUCER } from './companies.reducer';

export const COMPANIES_STORE = createStore(COMPANIES_REDUCER);