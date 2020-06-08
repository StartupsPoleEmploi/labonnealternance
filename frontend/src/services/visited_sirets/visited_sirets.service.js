import store from '../store';
import { VISITED_SIRETS_ACTIONS } from './visited_sirets.reducers';

class VisitedSiretServiceFactory {

    addVisited(siret) {
        store.dispatch({
            type: VISITED_SIRETS_ACTIONS.ADD_SIRET,
            data: { siret }
        });
    }
}


// Export as singleton
const visitedSiretService = new VisitedSiretServiceFactory();
Object.freeze(visitedSiretService);
export { visitedSiretService as VisitedSiretService };