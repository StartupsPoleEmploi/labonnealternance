import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Header extends Component {
    render() {
        return (
            <header>
                <Link className="logo-lba" to="/">
                    <img src="/static/img/logo/logo-blanc-lba.svg" alt="Retour à l'accueil" title="Retour à l'accueil" />
                </Link>

                <a className="logo-pe" href="https://www.pole-emploi.fr/">
                    <img src="/static/img/logo/logo-pe-NB.svg" alt="La Bonne Alternance est un site de Pôle Emploi" title="La Bonne Alternance est un site de Pôle Emploi" />
                </a>
            </header>
        );
    }
}