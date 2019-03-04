import { combineReducers, createStore } from 'redux';

import { AUTOCOMPLETE_JOB_REDUCER } from './autocomplete_job/autocomplete_job.reducer';
import { AUTOCOMPLETE_LOCATION_REDUCER } from './autocomplete_location/autocomplete_location.reducer';
import { COMPANY_DETAILS_REDUCER } from './company_details/company_details.reducer';
import { CURRENT_LOCATION_REDUCER } from './current_location/current_location.reducer';
import { FAVORITES_REDUCER } from './favorites/favorites.reducers';
import { FILTERS_REDUCER } from './filters/filters.reducers';
import { NOTIFICATION_REDUCER } from './notification/notification.reducers';
import { REQUEST_OCCURING_REDUCER } from './requests_occuring/request_occuring.reducers';
import { SOFT_SKILLS_REDUCER } from './soft_skills/soft_skills.reducers';
import { VIEWS_REDUCER } from './view/views.reducers';
import { VISITED_SIRETS_REDUCER } from './visited_sirets/visited_sirets.reducers';
import { COMPANIES_REDUCER } from './companies/companies.reducer';

let store = createStore(
  combineReducers({
    jobSuggestions: AUTOCOMPLETE_JOB_REDUCER,
    locationSuggestions: AUTOCOMPLETE_LOCATION_REDUCER,
    companies: COMPANIES_REDUCER,
    companyDetails: COMPANY_DETAILS_REDUCER,
    currentLocation: CURRENT_LOCATION_REDUCER,
    favorites: FAVORITES_REDUCER,
    filters: FILTERS_REDUCER,
    notification: NOTIFICATION_REDUCER,
    requestOccuring: REQUEST_OCCURING_REDUCER,
    softSkills: SOFT_SKILLS_REDUCER,
    currentView: VIEWS_REDUCER,
    visitedSirets: VISITED_SIRETS_REDUCER,
  })
);

export default store;