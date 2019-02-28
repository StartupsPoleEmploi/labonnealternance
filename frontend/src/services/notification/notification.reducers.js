import { Notification, NOTIFICATION_TYPE } from './notification';

export const NOTIFICATION_ACTIONS = {
    CREATE_INFO: 'CREATE_INFO',
    CREATE_WARNING: 'CREATE_WARNING',
    CREATE_ERROR: 'CREATE_ERROR',
    CREATE_SUCCESS: 'CREATE_SUCCESS',
    DELETE: 'DELETE_NOTIFICATION'
};

export const NOTIFICATION_REDUCER = (state = null, action) => {

    switch (action.type) {
        case (NOTIFICATION_ACTIONS.CREATE_INFO):
            return new Notification(
                NOTIFICATION_TYPE.INFO,
                action.data.messages
            );

        case (NOTIFICATION_ACTIONS.CREATE_WARNING):
            return new Notification(
                NOTIFICATION_TYPE.WARNING,
                action.data.messages
            );

        case (NOTIFICATION_ACTIONS.CREATE_ERROR):
            return new Notification(
                NOTIFICATION_TYPE.ERROR,
                action.data.messages
            );

        case (NOTIFICATION_ACTIONS.CREATE_SUCCESS):
            return new Notification(
                NOTIFICATION_TYPE.SUCCESS,
                action.data.messages
            );

        case (NOTIFICATION_ACTIONS.DELETE):
            return null;

        default:
            return state;
    }
};