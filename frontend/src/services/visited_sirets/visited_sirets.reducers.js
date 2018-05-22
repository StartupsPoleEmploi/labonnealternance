export const VISITED_SIRETS_ACTIONS = {
    ADD_SIRET: 'ADD_SIRET'
};

export const VISITED_SIRETS_REDUCERS = (state = new Map(), action) => {

    switch (action.type) {
        case VISITED_SIRETS_ACTIONS.ADD_SIRET: {
            let visitedSirets = new Map(state);
            visitedSirets.set(action.data.siret, '');
            return visitedSirets;
        }

        default:
            return state;
    }
};