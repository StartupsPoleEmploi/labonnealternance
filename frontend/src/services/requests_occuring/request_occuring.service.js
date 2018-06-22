import { REQUEST_OCCURING_ACTIONS } from './request_occuring.reducers';
import { REQUEST_OCCURING_STORE } from './request_occuring.store';

export class RequestOccuringService {
    addRequest () {
        REQUEST_OCCURING_STORE.dispatch({ type: REQUEST_OCCURING_ACTIONS.ADD_REQUEST });
    }

    removeRequest() {
        REQUEST_OCCURING_STORE.dispatch({ type: REQUEST_OCCURING_ACTIONS.REMOVE_REQUEST });
    }
}