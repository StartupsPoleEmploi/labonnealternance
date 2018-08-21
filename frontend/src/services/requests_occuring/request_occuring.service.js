import { REQUEST_OCCURING_ACTIONS } from './request_occuring.reducers';
import { REQUEST_OCCURING_STORE } from './request_occuring.store';

class RequestOccuringServiceFactory {
    addRequest () {
        REQUEST_OCCURING_STORE.dispatch({ type: REQUEST_OCCURING_ACTIONS.ADD_REQUEST });
    }

    removeRequest() {
        REQUEST_OCCURING_STORE.dispatch({ type: REQUEST_OCCURING_ACTIONS.REMOVE_REQUEST });
    }
}


// Export as singleton
const requestOccuringService = new RequestOccuringServiceFactory();
Object.freeze(requestOccuringService);
export { requestOccuringService as RequestOccuringService };