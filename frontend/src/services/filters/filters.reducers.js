export const FILTERS_ACTIONS = {
    SET_FILTERS: 'SET_FILTERS',
};

let initialState = { headcount: 'all', naf: 'all', rome: 'all' };
export const FILTERS_REDUCER = (state = initialState, action) => {

    switch (action.type) {
        case FILTERS_ACTIONS.SET_FILTERS: {
            return Object.assign({}, action.data.filters);
        }

        default:
            return state;
    }
};