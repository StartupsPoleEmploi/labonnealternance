import React, { Component } from 'react';

import store from '../../../services/store';
import { NotificationService } from '../../../services/notification/notification.service';
import Modal from '../modal';

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
        return true;
    }

    componentWillMount() {
        this.notificationStore = store.subscribe(() => {
            let notification = store.getState().notification;

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
            <Modal id="notification-modal" title={this.state.notification.messages[0]} onClose={this.onClose}>
                <div className="text">{this.state.notification.messages[0]}</div>
            </Modal>
        );
    }
}