import React, { Component } from 'react';

import { NOTIFICATION_TYPE } from '../../../services/notification/notification';
import { NOTIFICATION_STORE } from '../../../services/notification/notification.store';

require('./notification.css');

export class Notification extends Component {
    constructor(props) {
        super(props);

        // Notification type to css class
        this.typeToCss = [];
        this.typeToCss[NOTIFICATION_TYPE.INFO] = 'info';
        this.typeToCss[NOTIFICATION_TYPE.WARNING] = 'warning';
        this.typeToCss[NOTIFICATION_TYPE.ERROR] = 'error';
        this.typeToCss[NOTIFICATION_TYPE.SUCCESS] = 'success';

        this.state = {
            notification: undefined
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!this.state.notification && !nextState.notification) return false;
        return true;
    }

    componentWillMount() {
        // Check if a notification exists
        let notification = NOTIFICATION_STORE.getState();
        if (notification && !notification.display) this.setState({ notification });


        this.notificationStore = NOTIFICATION_STORE.subscribe(() => {
            let notification = NOTIFICATION_STORE.getState();

            // Remove notification ?
            if (!notification) {
                this.setState({ notification: undefined });
                return;
            }

            // Show notifications
            notification.display = true;
            this.setState({ notification });
        });
    }

    componentWillUnmount() {
        this.notificationStore();
    }

    getNotificationClass = () => 'notification '.concat(this.typeToCss[this.state.notification.type]);


    render() {
        if (!this.state.notification) return null;

        return (
            <div className={this.getNotificationClass()}>
                <ul className="list-no-margin-padding">
                    { this.state.notification.messages.map((message, index) => <li key={index}>{message}</li>) }
                </ul>
            </div>
        );
    }
}