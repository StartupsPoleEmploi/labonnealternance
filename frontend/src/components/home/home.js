import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Header } from '../shared/header/header';
import { OtherStartups } from '../shared/other_startups/other_startups';
import { Footer } from '../shared/footer/footer';
import { CookieBar } from '../shared/cookie_bar/cookie_bar';

require('./home.css');

export default class Home extends Component {
    render() {
        return (
            <div id="home">
                <div className="container">
                    <div className="beta">&nbsp;</div>
                    <Header showOffset={false} />

                    <main>
                        <section className="main-landing">
                            <h2 className="introduction">
                                <span>Trouvez ici les <strong><span className="no-break-word bold">42 000</span> entreprises</strong></span><br />
                                <span>qui <strong>vont</strong> recruter en alternance</span>
                            </h2>

                            <div className="button-container">
                                <Link className="button" to="/recherche" title="Commencer à chercher">C'est parti !</Link>
                            </div>

                            <div className="recruiter"><Link to="/acces-recruteur">Accès recruteur</Link></div>

                            <div className="footer">
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
                            </div>
                        </section>


                        <section className="more">
                                <div className="how-it-works max-size-1000">
                                    <h2>Comment ça marche ?</h2>
                                    <div>
                                        <div className="sr-only">
                                            <p>La Bonne Alternance utilise un algorithme vous propose des entreprises ayant déjà recruté en alternance dans le passé (sources : Pôle Emploi et le ministère du travail)</p>
                                            <p>Par conséquent, il ne s'agit pas d'offres en alternance et vous devez démarcher ces entreprises via des candidatures spontanées.</p>
                                            <p>Pour utiliser La Bonne Alternance, il suffit d'entrer le métier recherché et votre ville. Ensuite, on s'occupe du reste !</p>
                                        </div>
                                        <div className="images">
                                            <img className="img-responsive" src="/static/img/how-it-works/step-1.jpg" alt="" />
                                            <img className="img-responsive" src="/static/img/how-it-works/step-2.jpg" alt="" />
                                            <img className="img-responsive" src="/static/img/how-it-works/step-3.jpg" alt="" />
                                            <img className="img-responsive" src="/static/img/how-it-works/step-4.jpg" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="who-we-are max-size-1000">
                                    <h2>Qui sommes-nous ?</h2>
                                    <div>
                                        <a className="logo-pe" href="https://www.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">
                                            <img className="img-responsive" src="/static/img/logo/pole-emploi-couleur.svg" alt="La Bonne Alternance est un site de Pôle Emploi" title="La Bonne Alternance est un site de Pôle Emploi" />
                                        </a>
                                        <p>
                                            Pôle Emploi innove et propose un service pour vous permettre de trouver plus facilement des entreprises proposant régulièrement des contrats en alternance.
                                            La Bonne Alternance est une startup interne de Pôle Emploi créée et développée par des conseillers.<br />

                                            <Link to="/qui-sommes-nous" title="En savoir plus sur les startups Pôle Emploi">En savoir plus</Link>
                                        </p>
                                    </div>
                                </div>
                                <OtherStartups />
                                <Footer cssClass="not-fixed"/>
                        </section>
                    </main>

                    <CookieBar />

                </div>
            </div>
        );
    }
}
