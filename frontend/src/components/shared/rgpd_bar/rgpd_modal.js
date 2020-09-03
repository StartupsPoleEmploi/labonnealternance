import React, { Component } from 'react';
import RGPDService from '../../../services/rgpd.service';

export default class RGPDModal extends Component {

    closeModal = () => {
        // Notify parent
        if(this.props.closeModalFn) this.props.closeModalFn();
    }

    denyRGPD = () => {
        RGPDService.setRGPDConsent(false, true);
        this.closeModal();
    }

    acceptRGPD = () => {
        RGPDService.setRGPDConsent(true);
        this.closeModal();
    }

    render() {
        return (
            <div id="modal-rgpd" className="modal">
                <div className="modal-bg">&nbsp;</div>
                <div className="modal-content">
                    <div className="actions-zone">
                        <button onClick={this.closeModal}><span className="icon close-icon">&nbsp;</span></button>
                    </div>
                    <div className="title text-center">
                        <h2>Politique de confidentialité et utilisation de vos données personnelles</h2>
                    </div>

                    <div className="modal-body">

                        <p>Pour utiliser au mieux le service La Bonne Alternance, vous devez accepter la Politique de confidentialité de La Bonne Alternance.</p>

                        <p>
                            La Bonne Alternance dépose des cookies nécessaires au bon fonctionnement du site :<br />
                        </p>
                        <ul>
                            <li>des cookies de mesure d'audience via les sites Google Analytics et Hotjar</li>
                            <li>des cookies techniques pour permettre l'enregistrement de vos préférences ou de l'état de votre interface</li>
                        </ul>

                        <p>Toutes ces informations ont pour but d'assurer le bon fonctionnement du site et nous permettent également d'améliorer l'intérêt et l'ergonomie de nos services.</p>

                        <p>Notre service s’engage à ne pas communiquer vos données personnelles à des organismes tiers.</p>

                        <p className="text-center ">
                            <button onClick={this.acceptRGPD} className="button small-white">Accepter</button>
                            <button onClick={this.denyRGPD} className="button small-white">Refuser</button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
