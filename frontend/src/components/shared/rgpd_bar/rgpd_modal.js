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
                            <li>Des cookies anonymes de mesure d'usage via le site Google Analytics. Comme des informations sur votre support informatique (catégorie d’appareil, système d’exploitation, navigateur), ou votre navigation (méthode d’accès à notre site, durée de votre visite).<br />
                                Ces cookies nous permettent de mesurer les usages du site La bonne alternance, afin de l’améliorer.</li>
                            <li>Des cookies anonymes liés à la réalisation d’enquêtes et analyses via l’outil Hotjar.<br />
                                Ces cookies nous permettent d’identifier les usagers ayant déjà répondu à une enquête, afin de ne plus les solliciter sur le sujet.</li>
                            <li>Des cookies spécifiques à l’outil La bonne alternance.<br />
                                Ces cookies permettent l'enregistrement de vos préférences ou de l'état de votre interface</li>
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
