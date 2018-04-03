import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';

require('./who_we_are.css');

export default class FAQ extends Component {

    constructor(props) {
        super(props);
        this.SEOService = new SEOService();
    }

    componentDidMount() {
        this.SEOService.setTitle("Qui sommes-nous ?");
    }

    render() {
        return (
            <div id="who-we-are" className="max-size-1000">
                <Header showOffset={false} />

                <main>
                    <div>
                        <h1>Qui sommes-nous ?</h1>
                    </div>

                    <div className="other-startups clearfix">
                        <h2>D'autres services proposés par Pôle Emploi</h2>

                        <div>
                            <a href="https://labonneboite.pole-emploi.fr" target="_blank" rel="noopener noreferrer" className="la-bonne-boite">
                                <img src="/static/img/startups/la_bonne_boite.png" alt="La Bonne Boite"/>
                                <span>Trouvez les entreprises qui embauchent sans déposer d’offres d’emploi !</span>
                            </a>
                            <a href="https://labonneformation.pole-emploi.fr" target="_blank" rel="noopener noreferrer" className="la-bonne-formation">
                                <img src="/static/img/startups/la_bonne_formation.jpg" alt="La Bonne Formation"/>
                                <span>Trouvez une formation en fonction de votre profil ET du marché du travail.</span>
                            </a>
                            <a href="https://maintenant.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="maintenant">
                                <img src="/static/img/startups/maintenant.png" alt="Maintenant"/>
                                <span>Maintenant ! Trouver le bon job en moins de 5mn <strong>Pas de CV.</strong></span>
                            </a>
                            <a href="https://memo.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="memo">
                                <img src="/static/img/startups/memo.png" alt="Memo"/>
                                <span>Maintenant ! Trouver le bon job en moins de 5mn <strong>Pas de CV.</strong></span>
                            </a>
                            <a href="https://avril.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="avril">
                                <img src="/static/img/startups/avril.svg" alt="Avril"/>
                                <span>La VAE facile. Transformez votre expérience en diplôme reconnu.</span>
                            </a>
                            <a href="https://clara.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="clara">
                                <img src="/static/img/startups/clara.svg" alt="Clara"/>
                                <span>Vos aides en un clic. Découvrez les aides et mesures qui vont accélérer votre reprise d'emploi.</span>
                            </a>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}