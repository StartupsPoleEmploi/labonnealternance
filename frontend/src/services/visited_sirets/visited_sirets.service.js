import { VISITED_SIRETS_ACTIONS } from './visited_sirets.reducers';
import { VISITED_SIRETS_STORE } from './visited_sirets.store';

class VisitedSiretServiceFactory {

    addVisited(siret) {
        VISITED_SIRETS_STORE.dispatch({
            type: VISITED_SIRETS_ACTIONS.ADD_SIRET,
            data: { siret }
        })
    }
}


// Export as singleton
const visitedSiretService = new VisitedSiretServiceFactory();
Object.freeze(visitedSiretService);
export { visitedSiretService as VisitedSiretService };