import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Header } from '../shared/header/header';
import { OtherStartups } from '../shared/other_startups/other_startups';
import { Footer } from '../shared/footer/footer';
import { CookieBar } from '../shared/cookie_bar/cookie_bar';
import { SEOService } from '../../services/seo.service';

require('./home.css');

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.SEOService = new SEOService();
    }

    componentWillMount() {
        this.SEOService.displayNoFollow(false);
        this.SEOService.setTitle('Le site des entreprises qui recrutent en alternance');
    }

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
                                <span>qui recrutent <strong>régulièrement</strong> en alternance</span>
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
                                        <div className="text">
                                            <p>7 employeurs sur 10 recrutent sans déposer d’offres d’emploi. Il est donc essentiel dans votre recherche de proposer votre candidature à des entreprises n’ayant pas forcément déposées d’offres d’emploi en alternance.</p>
                                            <p>Notre algorithme La Bonne Alternance analyse les offres et les recrutements des 5 dernières années pour vous proposer les entreprises qui recrutent régulièrement  en alternance.</p>
                                            <p>Pour une meilleur lisibilité les résultats sont affichés sur une carte et en liste. Vous pouvez affiner la liste les entreprises par taille, métier et domaine . En cliquant sur une entreprise vous accédez à ses  données clés, à des conseils pour postuler ainsi qu'à ses coordonnées.</p>
                                            <p><strong>Maximiser vos chances !</strong>  Postulez auprès des entreprises qui recrutent régulièrement en alternance sans forcément avoir déposé d’offres. C’est parti !</p>
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
                                            Pôle emploi innove et propose un service exclusif pour vous permettre de trouver plus facilement des entreprises recrutant régulièrement en contrat d’alternance sans avoir forcément déposées d’offres d’emploi.<br />

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
