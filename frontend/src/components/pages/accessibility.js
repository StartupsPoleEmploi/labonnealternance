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
										<h1 id="accessibilite">Accessibilité</h1>
										<p>
											<em>Date de dernière mise à jour : {process.env.REACT_APP_BUILD_DATE}</em>
										</p>
										<h2 id="introduction">Introduction</h2>
										<p>L'initiative internationale pour l'accessibilité du Web (Web Accessiblility Initiative) définit l'accessibilité du Web comme suit :<br/></p>
										<p>L'accessibilité du Web signifie que les personnes en situation de handicap peuvent utiliser le Web. Plus précisément, qu'elles peuvent percevoir, comprendre, naviguer et interagir avec le Web, et qu'elles peuvent contribuer sur le Web. L'accessibilité du Web bénéficie aussi à d'autres, notamment les personnes âgées dont les capacités changent avec l'âge. L'accessibilité du Web comprend tous les handicaps qui affectent l'accès au Web, ce qui inclut les handicaps visuels, auditifs, physiques, de paroles, cognitives et neurologiques<br/></p>
										<p>L’article 47 de la loi n° 2005-102 du 11 février 2005 pour l’égalité des droits et des chances, la participation et la citoyenneté des personnes handicapées fait de l’accessibilité une exigence pour tous les services de communication publique en ligne de l’État, les collectivités territoriales et les établissements publics qui en dépendent.<br/></p>
										<p>Il stipule que les informations diffusées par ces services doivent être accessibles à tous.<br/></p>
										<p>Le référentiel général d’accessibilité pour les administrations (RGAA) rendra progressivement accessible l’ensemble des informations fournies par ces services.<br/></p>
										<p>Le site <a href="https://labonnealternance.pole-emploi.fr/">La bonne alternance</a> est en cours d’optimisation afin de le rendre conforme au <a href="http://references.modernisation.gouv.fr/referentiel/">RGAA v3</a>. La déclaration de conformité sera publiée ultérieurement.<br/></p>
										<h2 id="nos-engagements">Nos engagements</h2>
										<ul>
											<li>Audit de mise en conformité (en cours) pour nous aider à détecter les potentiels oublis d'accessibilité</li>
											<li>Déclaration d'accessibilité (en cours) pour expliquer en toute transparence notre démarche</li>
											<li>Mise à jour de cette page pour vous tenir informés de notre progression</li>
										</ul><br/>
										<p>Nos équipes ont ainsi travaillé sur les contrastes de couleur, la présentation et la structure de l’information ou la clarté des formulaires.</p>
										<p>Des améliorations vont être apportées régulièrement.</p>
										<h2 id="ameliorations-et-contact">Améliorations et contact</h2>
										<p>L'équipe de La bonne alternance reste à votre écoute et entière disposition, si vous souhaitez nous signaler le moindre défaut de conception.<br/></p>
										<p>Vous pouvez nous aider à améliorer l’accessibilité du site en nous signalant les problèmes éventuels que vous rencontrez :  <a href="mailto:labonnealternance@pole-emploi.fr">Contactez-nous</a><br/></p>
										<p>Vous pouvez également soumettre vos demandes de modification sur la <a href="https://github.com/StartupsPoleEmploi/labonnealternance/" target="_blank">plate-forme Github</a><br/></p>
                </main>

                <RGPDBar />
                <Footer />
            </div>
        );
    }
}
