import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import ReactGA from 'react-ga';

export class Footer extends Component {

    /*
    // No Facebook for now
    facebookClick = (event) => {
        // No e.preventDefault() because we follow the link

        ReactGA.event({ category: 'Social Network', action: 'Click on Facebook icon' });
    } */

    render() {
        return (
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
                        <li><Link to="/acces-recruteur">Accès recruteur</Link></li>
                        <li><Link to="/qui-sommes-nous">Qui sommes-nous ?</Link></li>
                        <li className="small"><Link to="/faq">FAQ</Link></li>
                        <li className="small"><Link to="/conditions-generales-utilisation">CGU</Link></li>
                    </ul>
                </div>

                <div className="flags">
                    <ul className="list-unstyled inline-list">
                        <li className="fse">
                            <a href="http://www.fse.gouv.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-FSE-color.svg" alt="Visiter le site du Fond Social Européen" /></a>
                        </li>
                        <li>
                            <a href="https://europa.eu/european-union/index_fr" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-ue.svg" alt="Visiter le site officiel de l'Union européenne" /></a>
                        </li>
                        <li className="pole-emploi">
                            <a href="https://www.pole-emploi.fr/accueil/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/pole-emploi-couleur.svg" alt="La Bonne Alternance est un service de Pôle Emploi" /></a>
                        </li>
                        <li className="fse-text">
                            <p>Ce dispositif est cofinancé par le Fond Social Européen dans le cadre du Programme opérationnel national "emploi et inclusion" 2014-2020</p>
                        </li>
                    </ul>
                </div>
            </footer>
        )
    }

}