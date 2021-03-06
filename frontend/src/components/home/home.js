import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { environment } from '../../environment';
import Header from '../shared/header/header';
import { OtherStartups } from '../shared/other_startups/other_startups';
import { Footer } from '../shared/footer/footer';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';
import { SEOService } from '../../services/seo.service';
import LazyLoadYoutube from '../shared/lazyload-youtube/lazyload-youtube';

import './home.css';

const {
  CTA1_LABEL, CTA1_TEXT, CTA1_TOOLTIP, CTA1_SLUG,
  CTA2_LABEL, CTA2_TEXT, CTA2_TOOLTIP, CTA2_SLUG,
} = environment;

export default class Home extends Component {
    componentWillMount() {
        SEOService.displayNoFollow(false);
        SEOService.setTitle('La Bonne Alternance | Trouvez votre alternance');
    }

    render() {
        return (
            <div id="home">
                <div className="form-1">&nbsp;</div>

                <div className="container">
                    <div className="beta">&nbsp;</div>
                    <Header showOffset={false} />

                    <main>
                        <section className="main-landing">
                            <h1 className="introduction">
                                <span>Trouvez votre alternance</span>
                            </h1>
                            <ul className="buttons-container">
                                <li className="button-container">
                                    <p dangerouslySetInnerHTML={{__html: CTA1_TEXT}}></p>
                                    <Link className="button gtm-home-button-searchcourses" to={CTA1_SLUG} title={CTA1_TOOLTIP} dangerouslySetInnerHTML={{__html: CTA1_LABEL}}></Link>
                                </li>
                                <li className="button-container">
                                    <p dangerouslySetInnerHTML={{__html: CTA2_TEXT}}></p>
                                    <Link className="button gtm-home-button-searchcoursesandcompanies" to={CTA2_SLUG} title={CTA2_TOOLTIP} dangerouslySetInnerHTML={{__html: CTA2_LABEL}}></Link>
                                </li>
                                <li className="button-container">
                                    <p>Je cherche une <strong>entreprise</strong> en alternance</p>
                                    <Link className="button gtm-home-button-searchcompanies" to="/recherche" title="Commencer à chercher">C'est parti !</Link>
                                </li>
                            </ul>

                            <div className="recruiter"><a href="https://labonneboite.pole-emploi.fr/informations-entreprise/action?origin=labonnealternance">Accès recruteur</a></div>

                            <div className="footer">
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
                        </section>


                        <section className="more">
                            <div className="how-it-works max-size-1000">
                                <h2 className="big">Comment repère-t-on les entreprises ?</h2>
                                <div className="img-right">
                                    <p>7 employeurs sur 10 recrutent sans déposer d’offres d’emploi. <br/>Il est essentiel dans votre recherche de proposer <br/>votre candidature à des entreprises n’ayant pas <br/>forcément déposé d’offres d’emploi en alternance.</p>
                                    <div className="recruteurs"><img src="/static/s.png" className="lazyload" data-src="/static/img/how-it-works/home-recruteurs.svg" alt="" /></div>
                                </div>
                                <div className="img-left">
                                    <div className="diagramme"><img src="/static/s.png" className="lazyload" data-src="/static/img/how-it-works/home-diagramme.svg" alt="" /></div>
                                    <p>Notre algorithme La Bonne Alternance analyse les offres et les <br/>recrutements des 6 dernières années pour vous proposer les <br/>entreprises qui recrutent régulièrement en alternance (contrat <br/> d'apprentissage ou contrat de professionnalisation).</p>
                                </div>
                                <div className="img-right">
                                    <p>Pour une meilleure lisibilité, les résultats sont affichés sur une <br/>carte et en liste. Vous pouvez affiner la liste des entreprises par <br/>taille, métier et domaine. En cliquant sur une entreprise, vous <br/>accédez à sa description, à ses coordonnées ainsi qu'à des conseils pour postuler.</p>
                                    <div className="map"><img src="/static/s.png" className="lazyload" data-src="/static/img/how-it-works/home-map.svg" alt="" /></div>
                                </div>

                            </div>

                            <div className="how-it-works max-size-1000">
                                <LazyLoadYoutube iframeTitle="Vidéo de présentation de La Bonne Alternance sur Youtube" youtubeUrl="https://www.youtube.com/embed/UgxlKSs5K_c" backgroundImage="/static/img/youtube/home.jpg" />
                            </div>

                            <div className="form-2"><div>&nbsp;</div></div>
                            <div className="who-we-are max-size-1200">
                                <h2 className="big">Qui sommes-nous ?</h2>
                                <div>
                                    <a className="logo-pe" href="https://www.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">
                                        <img  src="/static/s.png" className="lazyload img-responsive" data-src="/static/img/logo/pole-emploi-couleur.svg" alt="La Bonne Alternance est un site de Pôle Emploi" title="La Bonne Alternance est un site de Pôle Emploi" />
                                    </a>
                                    <p>
                                        Pôle Emploi innove et propose ce service pour vous permettre notamment de trouver des entreprises proposant régulièrement des contrats en alternance. La Bonne Alternance est une start-up interne de Pôle Emploi créée et développée par des conseillers.<br/>
                                        <Link to="/qui-sommes-nous" title="En savoir plus sur les startups Pôle Emploi">En savoir plus</Link>
                                    </p>
                                </div>
                            </div>
                            <OtherStartups />
                            <Footer cssClass="not-fixed" />
                        </section>
                    </main>

                    <RGPDBar />

                </div>
            </div>
        );
    }
}
