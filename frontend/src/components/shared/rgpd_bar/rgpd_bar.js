import React, { Component, Fragment } from 'react';

import RGPDModal from './rgpd_modal';
import RGPDService from '../../../services/rgpd.service';

require('./rgpd_bar.css');

export class RGPDBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: !RGPDService.userAcceptsRGPD(),
            showRGPDModal: false,
        }
    }

    showRGPDModal = () => {
        this.setState({ showRGPDModal: true });
    }
    closeRGPDModal = () => {
        this.setState({ showRGPDModal: false });
    }

    denyRGPD = () => {
        RGPDService.setRGPDConsent(false);
        this.hideBar();
    }

    acceptRGPD = () => {
        RGPDService.setRGPDConsent(true);
        this.hideBar();
    }

    hideBar = () => {
        console.log('hideBar')
        this.setState({ show: false });
    }

    render() {
        console.log(this.state.show);
        if(!this.state.show) return null;

        return(
            <Fragment>

                <div className="rgpd-banner">

                    <p>En poursuivant votre navigation sur ce site, vous acceptez nos conditions d'utilisation de vos données personnelles (RGPD).</p>
                    <ul className="list-unstyled list-inline">
                        <li><button onClick={this.acceptRGPD}><b>Accepter</b></button>&nbsp;-&nbsp;</li>
                        <li><button onClick={this.showRGPDModal}>En savoir plus</button>&nbsp;-&nbsp;</li>
                        <li><button onClick={this.denyRGPD}><b>Refuser</b></button></li>
                    </ul>
                    { this.state.showRGPDModal ? <RGPDModal closeModalFn={this.hideBar} /> : null }
                </div>

            </Fragment>
        );
    }
}