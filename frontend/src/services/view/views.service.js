import { VIEWS, VIEWS_ACTIONS } from './views.reducers';
import store from '../store';


class ViewsServiceFactory {
    setMapView() {
        store.dispatch({ type: VIEWS_ACTIONS.SET_MAP_VIEW });
    }
    setListView() {
        store.dispatch({ type: VIEWS_ACTIONS.SET_LIST_VIEW });
    }
    setFiltersView() {
        store.dispatch({ type: VIEWS_ACTIONS.SET_FILTERS_VIEW });
    }

    // Generic method
    setView(view) {
        if (view === VIEWS.MAP) store.dispatch({ type: VIEWS_ACTIONS.SET_MAP_VIEW });
        else if (view === VIEWS.LIST) store.dispatch({ type: VIEWS_ACTIONS.SET_LIST_VIEW });
        else if (view === VIEWS.FILTERS) store.dispatch({ type: VIEWS_ACTIONS.SET_FILTERS_VIEW });
    }
}

// Export as singleton
const viewsService = new ViewsServiceFactory();
Object.freeze(viewsService);
export { viewsService as ViewsService };
