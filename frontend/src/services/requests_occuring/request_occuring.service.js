import { REQUEST_OCCURING_ACTIONS } from './request_occuring.reducers';
import store from '../store';

class RequestOccuringServiceFactory {
    addRequest () {
        store.dispatch({ type: REQUEST_OCCURING_ACTIONS.ADD_REQUEST });
    }

    removeRequest() {
        store.dispatch({ type: REQUEST_OCCURING_ACTIONS.REMOVE_REQUEST });
    }
}


// Export as singleton
const requestOccuringService = new RequestOccuringServiceFactory();
Object.freeze(requestOccuringService);
export { requestOccuringService as RequestOccuringService };