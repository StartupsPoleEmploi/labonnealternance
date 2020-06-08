import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 *
 * Accessibility rules for modal :
 * - When the Modal is not open, it is not rendered into the DOM ==> need to be handle in parent component
 * - ✅ When rendered, the Modal is appended to the end of document.body. ==> Done with preact-portal
 * - ✅ The Modal has relevant WAI-ARIA attributes in accordance with accessibility guidelines
 *    => aria-modal="true"
 *    => role="dialog" ou "alertdialog" (last one if immediate attention is required)
 *    => aria-label
 * - ✅ Pressing the escape key will close the Modal.
 * - ✅ Clicking outside the Modal will close it.
 * - ✅ When open, scrolling is frozen on the main document beneath the Modal.
 * - ✅ When open, focus is drawn immediately to the Modal's close button.
 * - ✅ When the Modal closes, focus returns to the Modal's trigger button.
 * - ✅ Focus is trapped within the Modal when open => ensure by tabindex="-1"
 *
 * Sources :
 *  - https://assortment.io/posts/accessible-modal-component-react-portals-part-1
 *  - https://assortment.io/posts/accessible-modal-component-react-portals-part-2
 */

// Focus handling inspired by https://github.com/ghosh/micromodal
const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
];

const TAB_KEY = 9;
const ECHAP_KEY = 27;

export default class Modal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            role: this.props.role || 'dialog',
            hideClose: this.props.hideClose || false
        };
    }

    componentDidMount() {
        // Register last focus element
        this.activeElement = document.activeElement;

        // Register focusable nodes + Focus to the close button
        this.focusableNodes = document.querySelector('.modal .modal-content').querySelectorAll(FOCUSABLE_ELEMENTS);
        this.currentFocusIndex = 0;
        this.focusableNodes[this.currentFocusIndex].focus();

        // Disabled global scroll
        document.querySelector('html').classList.add('lock-scroll');
    }

    componentDidUpdate() {
        this.focusableNodes = document.querySelector('.modal .modal-content').querySelectorAll(FOCUSABLE_ELEMENTS);
    }

    onKeyDown = (e) => {
        // Echap key
        if (e.keyCode === ECHAP_KEY) { e.preventDefault(); this.closeModal(); }

        // Shift-alt-key => previous focusable element
        if (e.shiftKey && e.keyCode === TAB_KEY) {
            e.preventDefault(); this.focusPreviousNode();
        } else if (e.keyCode === TAB_KEY) {
            // Tab key only
            e.preventDefault(); this.focusNextNode();
        }
    }
    focusNextNode() {
        this.currentFocusIndex = this.currentFocusIndex + 1;
        if (this.currentFocusIndex >= this.focusableNodes.length) this.currentFocusIndex = 0;
        this.focusableNodes[this.currentFocusIndex].focus();
    }
    focusPreviousNode() {
        this.currentFocusIndex = this.currentFocusIndex - 1;
        if (this.currentFocusIndex < 0) this.currentFocusIndex = this.focusableNodes.length - 1;
        this.focusableNodes[this.currentFocusIndex].focus();
    }


    computeCssClass() {
        let cssClasses = 'modal-body';
        if (this.props.cssClass) cssClasses = cssClasses.concat(' ').concat(this.props.cssClass);
        return cssClasses;
    }

    closeModal = () => {
        if (this.state.hideClose) return;

        // Enabled scroll on the whole document
        document.querySelector('html').classList.remove('lock-scroll');

        // Focus on the last element
        this.activeElement.focus();
        this.props.onClose();
    }

    render() {
        const { id, title, children } = this.props;
        const { role, hideClose } = this.state;

        return ReactDOM.createPortal(
            <div id={id} className="modal" aria-modal="true" tabIndex="-1" role={role} aria-label={title}
	onKeyDown={this.onKeyDown}
            >
                <div className="modal-bg" onClick={this.closeModal}>&nbsp;</div>
                <div className="modal-content">
                    {
                        !hideClose ?
                            <button className="btn close" onClick={this.closeModal}>
                                <span className="sr-only">Fermer la fenêtre</span>
                                <span className="icon close-icon">&nbsp;</span>
                            </button> : null
                    }
                    {children}
                </div>
            </div>, document.body);
    }
}
