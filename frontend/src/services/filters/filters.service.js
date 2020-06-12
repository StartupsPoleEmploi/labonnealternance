import store from '../store';
import isArray from 'lodash/isArray';

import { FILTERS_ACTIONS } from './filters.reducers';

class FiltersServiceFactory {

    isFiltersActive() {
        let filters = store.getState().filters;
        for (let filter in filters) {
            if (filters[filter] !== 'all') return true;
        }
        return false;
    }

    saveFilters(filters) {
        store.dispatch({
            type: FILTERS_ACTIONS.SET_FILTERS,
            data: { filters }
        });
    }

    checkIfDiff(oldFilters, newFilters) {
        const keys = Object.keys(newFilters);
        let hasChanged = false;

        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];

            const oldValues = oldFilters[key];
            const newValues = newFilters[key];

            if(oldValues === 'all' && newValues === 'all') continue;
            else if(oldValues !== 'all' && newValues === 'all') { hasChanged=true; break; }
            else if(oldValues === 'all' && newValues !== 'all') { hasChanged=true; break; }
            else {
                // We need to compare the two arrays
                if(isArray(oldValues) && isArray(newValues)) {
                    if(oldValues.length !== newValues.length) { hasChanged = true; break; }
                } else {
                    hasChanged = true;
                    break;
                }
            }
        }

        return hasChanged;

    }
}


// Export as singleton
const filtersService = new FiltersServiceFactory();
Object.freeze(filtersService);
export { filtersService as FiltersService };