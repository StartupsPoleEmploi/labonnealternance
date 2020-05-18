import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import Header from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';

require('./cgu.css');

export default class CGU extends Component {

    componentDidMount() {
        SEOService.displayNoFollow(false);
        SEOService.setTitle("Conditions Générales d'utilisation");
    }

    render() {
        return (
            <div id="cgu" className="max-size-1000">
                <Header showOffset={false} />

                <main className="content">
                    <h1>Conditions d'utilisation</h1>
                    <p>L’utilisateur du service doit respecter ces conditions générales d’utilisation. Elles peuvent être modifiées par Pôle emploi. L’utilisateur est donc invité à consulter régulièrement la dernière version mise à jour.</p>
                    <div><em>Dernière mise à jour le : 15/05/2020</em></div>

                    <h2>1. Mentions légales</h2>
                    <h3>Editeur</h3>
                    <p>
                        Pôle emploi<br />
                        15 avenue du Docteur Gley<br />
                        75987 Paris cedex 20<br />
                        Tél. 01 40 30 60 00<br />
                    </p>

                    <h3>Directeur de la publication</h3>
                    <p>Monsieur Jean Bassères, Directeur général.</p>

                    <h3>Hébergeur</h3>
                    <p>
                        OVH<br />
                        2 rue Kellermann<br />
                        59100 Roubaix<br />
                        Tél. 09 72 10 10 07<br />
                    </p>

                    <h2>2. Object du site</h2>
                    <p>Le site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> a pour objet de faciliter les démarches de candidatures spontanées de l’utilisateur en l’aidant à identifier des entreprises ou organismes ayant un potentiel d’embauche de contrats en alternance dans un secteur d’emploi et un secteur géographique donnés.</p>

                    <h2>3. Fonctionnement de La bonne alternance</h2>
                    <p>Le service proposé sur le site <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> permet à l’utilisateur de rechercher des entreprises ou organismes susceptibles de recruter en alternance des profils similaires au sien, en fonction des données qu’il a saisi (métier, secteur géographique).</p>
                    <p>Les entreprises ou organismes qui apparaissent dans les résultats de recherche peuvent être classés en fonction de leur proximité géographique par rapport au périmètre défini par l’utilisateur. </p>
                    <p>Lorsque celles-ci sont renseignées, l’utilisateur peut entrer en contact avec l’entreprise ou l’organisme au moyen des coordonnées indiquées sur la fiche de l’entreprise ou de l’organisme. </p>
                    <p>À tout moment, chaque entreprise peut d’une part s’opposer à ce que son nom apparaisse dans les résultats de recherche ou d’autre part, demander à être mise en avant. <br />
                    Elle peut également demander la modification/suppression des informations communiquées (ex. coordonnées) sur le site La bonne alternance en remplissant le formulaire disponible via le lien « Modifier ces informations » présent sur la fiche la concernant ou en accédant au <a href="https://labonneboite.pole-emploi.fr/informations-entreprise/action?origin=labonnealternance">formulaire recruteur</a> directement depuis la page d’accueil du site.</p>

                    <h2>4. Protection des données à caractère personnel</h2>
                    <p>L’utilisation du moteur de recherche disponible sur le site internet La bonne alternance nécessite d’indiquer le(s) métier(s) recherché(s) ainsi que le périmètre géographique souhaité. <br />
                    Pôle emploi traite également des données relatives aux entreprises qui peuvent concerner directement des personnes physiques, notamment les coordonnées des interlocuteurs personnes physiques de ces entreprises. <br />
                    Ces données sont collectées et traitées par Pôle emploi uniquement dans le but de fournir, à la requête de l’utilisateur, la liste des entreprises ou organismes ayant un potentiel d’embauche dans un secteur d’emploi et géographique donné ainsi que leurs coordonnées de contact. S’agissant des coordonnées de contact, les destinataires des données sont les utilisateurs du site internet La bonne alternance. S’agissant des données relatives aux utilisateurs concernant leur recherche, seul Pôle emploi a accès aux données. </p>
                    <p>Pôle emploi est le responsable de ce traitement. Ses coordonnées sont les suivantes : Pôle Emploi, 1-5 rue du docteur Gley, 75987, Paris cedex 20. Au titre de la licéité du traitement exigée par l’article 6 du règlement général (UE) sur la protection des données n°2016/679 du 27 avril 2016 (RGPD), le fondement juridique du traitement est la mission d’intérêt public dont est investi Pôle emploi en vertu de l’article L.5312-1 du code du travail qui consiste notamment à mettre en relation l’offre et la demande d’emploi. </p>
                    <p>Conformément aux articles 12 à 23 du règlement général (UE) sur la protection des données n°2016/679 du 27 avril 2016 et à la loi Informatique et libertés n°78-17 du 6 janvier 1978 modifiée, vous bénéficiez d’un droit d’accès, de rectification, de limitation, de définir des directives sur le sort des données après votre mort et le droit de porter une réclamation devant la Commission nationale de l’informatique et des libertés pour les données vous concernant. Pour exercer vos droits, vous pouvez vous adresser au délégué à la protection des données de Pôle emploi (1 avenue du Docteur Gley, 75987 Paris cedex 20 ; <a href="mailto:courriers-cnil@pole-emploi.fr">courriers-cnil@pole-emploi.fr</a>)</p>

                    <h2>5. Cookies </h2>
                    <h3>5.1 Qu'est-ce qu'un cookie ?</h3>
                    <p>Un cookie est un petit fichier texte déposé sur le terminal des utilisateurs (par exemple, un ordinateur, une tablette, un smartphone, etc.) lors de la visite d’un site internet.<br />
                    Il contient plusieurs données : le nom du serveur qui l’a déposé, un identifiant sous forme de numéro unique, et une date d’expiration. Les cookies ont différentes fonctionnalités. Ils ont pour but d’enregistrer les paramètres de langue d’un site, de collecter des informations relatives à votre navigation sur les sites, d’adresser des services personnalisés, etc.<br />
                    Seul l’émetteur d’un cookie est susceptible de lire, enregistrer ou de modifier les informations qui y sont contenues.</p>

                    <h3>5.2 Les cookies déposés sur La bonne alternance</h3>
                    <p><strong>Les cookies strictement nécessaires au fonctionnement du site internet</strong></p>
                    <p>Des cookies sont utilisés sur le site internet La bonne alternance pour permettre le bon fonctionnement du site internet et l’utilisation des principales fonctionnalités du site (ex. le maintien de la connexion, stockage du consentement, etc.).  </p>
                    <p>Sans ces cookies, l’utilisation du site peut être dégradée. L’utilisateur peut cependant s’opposer à leur dépôt en suivant les indications données au point 5.3.</p>

                    <p><strong>Les cookies statistiques ou de mesure d’audience</strong></p>
                    <p>Le site internet La bonne alternance utilise des cookies, y compris des cookies déposés par des tiers (ex. Google, Hotjar), ayant pour finalité la mesure d’audience dans le but d'améliorer l'expérience utilisateur et la performance du site internet. L’utilisateur peut paramétrer le dépôt des cookies en suivant les indications données au point 5.3.</p>

                    <h3>5.3 Accepter ou refuser les cookies</h3>
                    <p>L’utilisateur peut accepter ou refuser le dépôt de tout ou partie des cookies, à tout moment, en modifiant les paramètres de son navigateur (consulter la fonction « Aide » du navigateur pour en savoir plus) ou en se rendant sur l’une des pages suivantes, selon le navigateur utilisé : 
                    <ul>
                        <li>Google Chrome : <a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank">https://support.google.com/chrome/answer/95647?hl=fr</a></li>
                        <li>Internet Explorer : <a href="https://support.microsoft.com/fr-fr/help/17442" target="_blank">https://support.microsoft.com/fr-fr/help/17442</a></li>
                        <li>Mozilla Firefox : <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank">https://support.mozilla.org/fr/kb/activer-desactiver-cookies</a></li>
                        <li>Safari : <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank">https://support.apple.com/fr-fr/guide/safari/sfri11471/mac</a></li>
                    </ul>
                    </p>
                    <p>Pour information, la plupart des navigateurs acceptent par défaut le dépôt de cookies.<br />
                    Pour plus d’informations sur les cookies et les moyens permettant d’empêcher leur installation, l’utilisateur peut se rendre sur la page dédiée sur le site internet de la CNIL : <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank">www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser</a>.</p>

                    <h2>6. Responsabilité</h2>
                    <p>Les informations publiées sur le site internet La bonne alternance sont fournies à titre indicatif et peuvent être modifiées à tout moment. Pôle emploi ne garantit pas l’exhaustivité des résultats de recherche ni l’absence d’erreurs dans les résultats communiqués.</p>
                    <p>Pôle emploi ne saurait être tenu pour responsable vis-à-vis de l’utilisateur des dommages résultant de l’utilisation du site internet La bonne alternance, de l’impossibilité d’y accéder et de l’utilisation des sites tiers vers lesquels le site redirige.</p>

                    <h2>7. Obligations de l'utilisateur</h2>
                    <p>L’utilisation du site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> est soumise au respect par  l’utilisateur : 
                    <ul>
                        <li>de la législation française;</li>
                        <li>des présentes conditions d’utilisation;</li>
                        <li>des conditions d’utilisation de l’Emploi store disponibles à l’adresse suivante : <a href="http://www.emploi-store.fr/portail/conditionsgeneralesutilisation" target="_blank">http://www.emploi-store.fr/portail/conditionsgeneralesutilisation</a>.</li>
                    </ul>
                    </p>

                    <h2>8. Propriété intellectuelle</h2>
                    <p>Les marques Pôle emploi et La bonne alternance sont protégées au titre des articles L.712-1 et suivants du code de la propriété intellectuelle. Toute représentation, reproduction ou diffusion, intégrale ou partielle de la marque Pôle emploi et/ou de la marque La bonne alternance, sur quelque support que ce soit, sans l'autorisation expresse et préalable de Pôle emploi constitue un acte de contrefaçon, sanctionné en application de l’article L.716-1 du même code.<br />
                    Par ailleurs, le site <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> contient des contenus sur lesquels des tiers détiennent des droits de propriété intellectuelle (dessin, graphisme, marque, etc.) ou un droit à l’image (photo, visuel mettant en scène une personne physique, vidéo, etc.). Les internautes ne sont pas autorisés à réutiliser ces contenus en l’absence de l’autorisation préalable et expresse de ces tiers.</p>
                   
                </main>

                <RGPDBar />

                <Footer />
            </div>
                );
            }
}
