import { createStore } from 'redux';

import { AUTOCOMPLETE_JOB_REDUCER } from './autocomplete_job.reducer';

export const AUTOCOMPLETE_JOB_STORE = createStore(AUTOCOMPLETE_JOB_REDUCER);