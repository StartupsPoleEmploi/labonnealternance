import { NOTIFICATION_ACTIONS } from './notification.reducers';
import { NOTIFICATION_STORE } from './notification.store';

export class NotificationService {

    createInfo(messages) {
        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_INFO,
            data: { messages }
        });
    }

    createWarning(messages) {
        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_WARNING,
            data: { messages }
        });
    }

    createError(messages) {
        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_ERROR,
            data: { messages }
        });
    }

    createSuccess(messages) {
        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_SUCCESS,
            data: { messages }
        });
    }

    deleteNotification() {
        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.DELETE
        });
    }
}