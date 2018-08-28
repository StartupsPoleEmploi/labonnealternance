import { NOTIFICATION_ACTIONS } from './notification.reducers';
import { NOTIFICATION_STORE } from './notification.store';

class NotificationServiceFactory {

    _handleKey(key) {

        /*
        When a key is given, we checked if this key exists in localStorage.
        If not, create it and return true to allow the display of the modal.
        If exist, return false to disallow the modal.

        This functionality allow that some notification are only display once to the user
        */

        if (!key) return true;

        let exists = localStorage.setItem(key, '') !== undefined;
        if (!exists) {
            localStorage.setItem(key, '');
            return true;
        }
        return false;
    }

    createInfo(messages, key= undefined) {
        let createNotification = this._handleKey(key);
        if (!createNotification) return;

        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_INFO,
            data: { messages }
        });
    }

    createWarning(messages, key= undefined) {
        let createNotification = this._handleKey(key);
        if (!createNotification) return;

        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_WARNING,
            data: { messages }
        });
    }

    createError(messages, key= undefined) {
        let createNotification = this._handleKey(key);
        if (!createNotification) return;

        NOTIFICATION_STORE.dispatch({
            type: NOTIFICATION_ACTIONS.CREATE_ERROR,
            data: { messages }
        });
    }

    createSuccess(messages, key= undefined) {
        let createNotification = this._handleKey(key);
        if (!createNotification) return;

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

// Export as singleton
const notificationService = new NotificationServiceFactory();
Object.freeze(notificationService);
export { notificationService as NotificationService };