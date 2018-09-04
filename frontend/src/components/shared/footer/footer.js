import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import RGPDModal from '../rgpd_bar/rgpd_modal';

export class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showRGPDModal: false,
        }
    }

    showRGPDModal = () => {
        this.setState({ showRGPDModal: true });
    }
    closeRGPDModal = () => {
        this.setState({ showRGPDModal: false });
    }

    render() {
        return (
            <Fragment>
                <footer id="global-footer" className={this.props.cssClass}>

                    {/*<div className="follow">
                        <p>
                        <span>Suivez-nous sur :<br/></span>
                        <a onClick={this.facebookClick} href="#" target="_blank" rel="noopener noreferrer" title="Suivez-nous sur notre page Facebook">
                        <img src="/static/img/logo/facebook.png" alt="" />
                        </a>
                        </p>
                    </div>*/}

                    <div className="links">
                        <ul className="list-unstyled inline-list">
                            <li><a href="https://labonneboite.pole-emploi.fr/informations-entreprise?origin=labonnealternance">Accès recruteur</a></li>
                            <li><Link to="/qui-sommes-nous">Qui sommes-nous ?</Link></li>
                            <li className="small"><button onClick={this.showRGPDModal} title="Consulter notre politique sur les données personnelles">RGPD</button></li>
                            <li className="small"><Link to="/faq">FAQ</Link></li>
                            <li className="small"><Link to="/conditions-generales-utilisation">CGU</Link></li>
                            <li><a href="mailto:l%61bo%6En%65al%74e%72nance@p%6Fle%2Demploi.%66r">Contact</a></li>
                            <li className="hide-mobile"><a href="https://github.com/StartupsPoleEmploi/labonnealternance" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">Code source ouvert</a></li>
                        </ul>
                    </div>

                    <div className="flags">
                        <ul className="list-unstyled inline-list">
                            <li className="fse">
                                <a href="http://www.fse.gouv.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-FSE-color.svg" alt="Visiter le site du Fonds Social Européen" /></a>
                            </li>
                            <li>
                                <a href="https://europa.eu/european-union/index_fr" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-ue.svg" alt="Visiter le site officiel de l'Union européenne" /></a>
                            </li>
                            <li className="pole-emploi">
                                <a href="https://www.pole-emploi.fr/accueil/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/pole-emploi-couleur.svg" alt="La Bonne Alternance est un service de Pôle Emploi" /></a>
                            </li>
                            <li className="fse-text">
                                <p>Ce dispositif est cofinancé par le Fonds Social Européen dans le cadre du Programme opérationnel national "emploi et inclusion" 2014-2020</p>
                            </li>
                        </ul>
                    </div>
                </footer>

                { this.state.showRGPDModal ? <RGPDModal closeModalFn={this.closeRGPDModal} /> : null }

            </Fragment>
        )
    }

}