import React, { Component } from 'react';

export class MobileResultPopup extends Component {
    render() {
        return (
            <div id="mobile-result-popup" className="modal">
                <div className="modal-bg">&nbsp;</div>
                <div className="modal-content">
                    <button className="close" onClick={this.props.onClose}>
                        <span className="icon close-icon">&nbsp;</span>
                    </button>
                    <div className="text">{this.props.message}</div>
                </div>
            </div>
        );
    }
}