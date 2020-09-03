import React, { Component } from 'react';

import { Footer } from '../shared/footer/footer';

import Header from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';

export default class FAQ extends Component {

    componentDidMount() {
        SEOService.setTitle("Qui sommes-nous ?");
    }

    render() {
        return (
            <div className="max-size-1000">
                <Header showOffset={false} />

                <main className="content">
                    <h1 id="developpeurs">Développeurs</h1>
                    <h2 id="code-source-ouvert">Code source ouvert</h2>
                    <p>
                      <a href="https://github.com/StartupsPoleEmploi/labonnealternance">La bonne alternance - Recherche d'une entreprise en alternance :</a>
                    </p>
                    <p>
                      <a href="https://github.com/mission-apprentissage/idea-front">Idea - Recherche d'une formation et/ou d'un organisme de formation en apprentissage :</a>
                    </p>
                    <h2 id="apis">APIs</h2>
                    <p>
                      <a href="https://www.emploi-store-dev.fr/portail-developpeur/detailapicatalogue/la-bonne-alternance-v1?id=5b9a1742243a5f3873a4d2e5">La bonne alternance - Entreprises qui recrutent en alternance :</a>
                    </p>
                    <p>
                      <a href="https://www.emploi-store-dev.fr/portail-developpeur/detailapicatalogue/la-bonne-boite-v1?id=57909ba23b2b8d019ee6cc5f">La bonne boite - Entreprises qui recrutent en CDI et CDD de plus de 30j :</a>
                    </p>
                    <p>
                      <a href="https://github.com/mission-apprentissage/idea-api">Idea - recherche d'une formation et/ ou d'une entreprise dans le cadre d'un contrat en apprentissage :</a>
                    </p>
                    <h2 id="widget">Widget</h2>
                    <p>
                      <a href="https://www.emploi-store-dev.fr/portail-developpeur-cms/home/catalogue-des-api/documentation-des-api/api/api-la-bonne-alternance-v1/widget---requeter-et-afficher-le.html">La bonne alternance - Requêter et afficher les entreprises qui recrutent en alternance :</a>
                    </p>
                </main>

                <RGPDBar />
                <Footer />
            </div>
        );
    }
}
