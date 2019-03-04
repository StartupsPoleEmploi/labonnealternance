export const VIEWS = {
    MAP: 'map',
    LIST: 'list',
    FILTERS: 'filters',
}

export const VIEWS_ACTIONS = {
    SET_MAP_VIEW: 'SET_MAP_VIEW',
    SET_LIST_VIEW: 'SET_LIST_VIEW',
    SET_FILTERS_VIEW: 'SET_FILTERS_VIEW',
};

let initialState = VIEWS.MAP;
export const VIEWS_REDUCER = (state = initialState, action) => {

    switch (action.type) {
        case VIEWS_ACTIONS.SET_MAP_VIEW:
            return VIEWS.MAP;

        case VIEWS_ACTIONS.SET_LIST_VIEW:
            return VIEWS.LIST;

        case VIEWS_ACTIONS.SET_FILTERS_VIEW:
            return VIEWS.FILTERS;

        default:
            return state;
    }
};