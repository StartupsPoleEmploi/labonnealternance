import { VIEWS_STORE } from './views.store';
import { VIEWS_ACTIONS } from './views.reducers';
import { VIEWS } from './views.reducers';

class ViewsServiceFactory {
    setMapView() {
        VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_MAP_VIEW });
    }
    setListView() {
        VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_LIST_VIEW });
    }
    setFiltersView() {
        VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_FILTERS_VIEW });
    }

    // Generic method
    setView(view) {
        if (view === VIEWS.MAP) VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_MAP_VIEW });
        else if (view === VIEWS.LIST) VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_LIST_VIEW });
        else if (view === VIEWS.FILTERS) VIEWS_STORE.dispatch({ type: VIEWS_ACTIONS.SET_FILTERS_VIEW });
    }
}

// Export as singleton
const viewsService = new ViewsServiceFactory();
Object.freeze(viewsService);
export { viewsService as ViewsService };