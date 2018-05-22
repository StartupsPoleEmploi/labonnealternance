import { VISITED_SIRETS_ACTIONS } from './visited_sirets.reducers';
import { VISITED_SIRETS_STORE } from './visited_sirets.store';

export class VisitedServicesService {

    addVisited(siret) {
        VISITED_SIRETS_STORE.dispatch({
            type: VISITED_SIRETS_ACTIONS.ADD_SIRET,
            data: { siret }
        })
    }
}