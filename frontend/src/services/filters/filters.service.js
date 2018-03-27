import { FILTERS_STORE } from './filters.store';
import { FILTERS_ACTIONS } from './filters.reducers';

export class FiltersService {

    isFiltersActive() {
        let filters = FILTERS_STORE.getState();
        for (let filter in filters) {
            if (filters[filter] !== 'all') return true;
        }
        return false;
    }

    saveFilters(filters) {
        FILTERS_STORE.dispatch({
            type: FILTERS_ACTIONS.SET_FILTERS,
            data: { filters }
        });
    }
}