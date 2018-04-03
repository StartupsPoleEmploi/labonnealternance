import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Header } from '../shared/header/header';

require('./home.css');

export default class Home extends Component {
    render() {
        return (
            <div id="home">
                <div className="container">
                    <div className="beta">&nbsp;</div>
                    <Header showOffset={false} />

                    <main className="container">
                        <h2 className="introduction">
                            <span>Trouvez ici les <strong><span className="no-break-word bold">42 000</span> entreprises</strong></span><br />
                            <span>qui <strong>vont</strong> recruter en alternance</span>
                        </h2>

                        <div className="button-container">
                            <Link className="button" to="/recherche" title="Commencer à chercher">C'est parti !</Link>
                        </div>
                    </main>

                    <footer>
                        <ul className="list-unstyled inline-list">
                            <li className="fse">
                                <a href="http://www.fse.gouv.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-FSE-color.svg" alt="Visiter le site du Fond Social Européen" /></a>
                            </li>
                            <li>
                                <a href="https://europa.eu/european-union/index_fr" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/logo-ue.svg" alt="Visiter le site officiel de l'Union européenne" /></a>
                            </li>
                            <li
                                ><a href="https://www.pole-emploi.fr/accueil/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre"><img src="/static/img/logo/pole-emploi-couleur.svg" alt="La Bonne Alternance est un service de Pôle Emploi" /></a>
                            </li>
                            <li className="fse-text">
                                <p>Ce dispositif est cofinancé par le Fond Social Européen dans le cadre du Programme opérationnel national "emploi et inclusion" 2014-2020</p>
                            </li>
                        </ul>
                    </footer>

                </div>
            </div>
        );
    }
}
