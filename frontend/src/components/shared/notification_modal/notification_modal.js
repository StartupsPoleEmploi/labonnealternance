import React, { Component } from 'react';

import { NOTIFICATION_STORE } from '../../../services/notification/notification.store';
import { NotificationService } from '../../../services/notification/notification.service';

require('./notification_modal.css');

export class NotificationModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notification: undefined
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!this.state.notification && !nextState.notification) return false;
        if(this.state.notification === nextState.notification) return false;
    }

    componentWillMount() {
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

    onClose = () => {
        NotificationService.deleteNotification();
    }

    render() {
        if (!this.state.notification) return null;

        return (
            <div id="notification-modal" className="modal">
                <div className="modal-bg">&nbsp;</div>
                <div className="modal-content">
                    <button className="close" onClick={this.onClose}>
                        <span className="icon close-icon">&nbsp;</span>
                    </button>
                    <div className="text">{this.state.notification.messages[0]}</div>
                </div>
            </div>
        );
    }
}