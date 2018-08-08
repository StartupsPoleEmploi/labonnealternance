import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { SEOService } from '../../services/seo.service';

require('./not_found.css');

export default class NotFound extends Component {
    constructor(props) {
        super(props);
        this.SEOService = new SEOService();
    }

    componentDidMount() {
        this.SEOService.displayNoFollow(true);
        this.SEOService.setTitle("Page non trouvée");
    }

    render() {
        return (
            <div id="not-found">
                <main className="not-found-content">
                    <Link to="/">
                        <img className="lba-logo" src="/static/img/logo/logo-noir-lba.svg" alt="La Bonne Alternance" />
                    </Link>
                    <h1 className="sr-only">Page non trouvée</h1>

                    <div className="text-container">
                        <div className="images">
                            <h1>
                                <span>Erreur</span><br/>
                                <span className="text-404">404</span>
                            </h1>

                            <img className="img-responsive" src="/static/img/not_found/404-illustration.svg" alt="" />
                        </div>
                        <div className="text">
                            <p>Oups, nous n'avons pas trouvé la page que vous avez demandée.</p>
                            <p>Faites une nouvelle recherche !</p>
                            <div className="button-container">
                                <Link className="button blue-button" to="/">Aller à la page d'accueil</Link>
                            </div>
                        </div>

                    </div>
                    <div className="button-container-footer">
                        <Link className="button blue-button" to="/">Aller à la page d'accueil</Link>
                    </div>

                </main>
            </div>
        );
    }
}
