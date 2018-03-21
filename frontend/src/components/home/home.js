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
                    <Header />

                    <main className="container max-size-1000">
                        <h2 className="introduction">
                            <strong>410 000 entreprises</strong><br />
                            <span>recrutent en alternance </span>
                            <strong>ici</strong>
                        </h2>

                        <div className="button-container">
                            <Link className="button" to="/recherche" title="Commencer à chercher">J'ai compris !</Link>
                        </div>
                    </main>

                    <footer>
                        <ul className="list-unstyled inline-list">
                            <li className="fse"><a href="#"><img src="/static/img/logo/logo-FSE-color.svg" alt="" /></a></li>
                            <li><a href="#"><img src="/static/img/logo/logo-ue.svg" alt="" /></a></li>
                            <li><a href="#"><img src="/static/img/logo/pole-emploi-couleur.svg" alt="" /></a></li>
                            <li className="fse-text"><p>Ce dispositif est cofinancé par le Fond Social Européen dans le cadre du Programme opérationnel national "emploi et inclusion" 2014-2020</p></li>
                        </ul>
                    </footer>

                </div>
            </div>
        );
    }
}
