export const REQUEST_OCCURING_ACTIONS = {
    ADD_REQUEST: 'ADD_REQUEST',
    REMOVE_REQUEST: 'REMOVE_REQUEST',
};

export const REQUEST_OCCURING_REDUCER = (state = 0, action) => {

    switch (action.type) {
        case REQUEST_OCCURING_ACTIONS.ADD_REQUEST:
            return state + 1;


        case REQUEST_OCCURING_ACTIONS.REMOVE_REQUEST: {
            let newState = state - 1;
            if (newState < 0) newState = 0;
            return newState;
        }

        default:
            return state;
    }
};