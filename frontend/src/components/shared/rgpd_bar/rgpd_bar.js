import React, { Component, Fragment } from 'react';

import RGPDModal from './rgpd_modal';
import RGPDService from '../../../services/rgpd.service';

import './rgpd_bar.css';

export class RGPDBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: !RGPDService.userAcceptsRGPD(),
            showRGPDModal: false,
        };
    }

    showRGPDModal = () => {
        this.setState({ showRGPDModal: true });
    }
    closeRGPDModal = () => {
        this.setState({ showRGPDModal: false });
        if (RGPDService.shouldDisplayRGPD() === false) {
          this.setState({ show: false });
        }
    }

    denyRGPD = () => {
        RGPDService.setRGPDConsent(false);
        this.setState({ show: false });
    }

    acceptRGPD = () => {
        RGPDService.setRGPDConsent(true);
        this.setState({ show: false });
    }

    render() {
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
                </div>

                { this.state.showRGPDModal ? <RGPDModal closeModalFn={() => this.closeRGPDModal()} /> : null }
            </Fragment>
        );
    }
}
