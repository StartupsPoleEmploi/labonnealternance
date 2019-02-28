import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import Header from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';

export default class CGU extends Component {

    componentDidMount() {
        SEOService.displayNoFollow(false);
        SEOService.setTitle("Conditions Générales d'utilisation");
    }

    render() {
        return (
            <div id="who-we-are" className="max-size-1000">
                <Header showOffset={false} />

                <main className="content">
                    <h1>Conditions d'utilisation</h1>

                    <h2>1. Informations légales</h2>
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

                    <h2>2. Object du site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a></h2>
                    <p>Le site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> a pour objet de faciliter les démarches de candidatures spontanée de l’utilisateur en l’aidant à identifier des entreprises ou organismes ayant un potentiel d’embauche dans un secteur d’emploi et un secteur géographique donnés.</p>
                    <p>La détermination de l'adresse en fonction de la position actuelle est réalisée via le site : <a href="https://adresse.data.gouv.fr/" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">https://adresse.data.gouv.fr/</a></p>

                    <h2>3. Données collectées</h2>
                    <p>Les seules données collectées, pour permettre le fonctionnement du service, sont le type d’emploi recherché et le périmètre géographique souhaité. Ces données sont collectées et traitées par Pôle emploi pour la seule finalité définie à l’article 2 et ne sont pas conservées.</p>
                    <p>Toutefois, l’utilisateur est informé que conformément aux articles 39 et suivants de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, il dispose d’un droit d’accès aux informations le concernant, en s’adressant :</p>
                    <ul>
                        <li>s’il est demandeur d’emploi : à son agence Pôle emploi, par voie postale ou électronique</li>
                        <li>pour toute autre personne : au correspondant informatique et libertés de Pôle Emploi aux coordonnées suivantes : Pôle emploi, Correspondant informatique et libertés, 1-5 avenue du Docteur Gley, 75987 Paris cedex 20 (adresse électronique Courriers-cnil@pole-emploi.fr).</li>
                    </ul>
                    <p>Il est possible pour les entreprises voulant ne plus apparaître dans les résultats de La Bonne Alternance, ou voulant modifier leurs coordonnées ou tout renseignement qui leur paraitrait inexact, de <a href="https://labonneboite.pole-emploi.fr/connexion-recruteur?origin=labonnealternance">faire une demande de modification</a>.</p>

                    <h2>4. Cookies</h2>
                    <p>Pôle emploi utilise des cookies permettant d’enregistrer des informations relatives à la navigation de l’utilisateur de manière anonyme et dans un but d’analyses statistiques. Les cookies générés ont une durée de conservation limitée à 12 mois. Ces cookies sont émis par les sociétés Google et Hotjar. L’utilisateur peut s’opposer à l'enregistrement de cookies sur son ordinateur :</p>
                        <ul>
                            <li>en configurant son poste informatique de la manière suivante :
                                <p><strong>Pour Microsoft Internet Explorer 6.0 et + :</strong></p>
                                <ol>
                                    <li>Choisir le menu "Outils" (ou "Tools"), puis "Options Internet" (ou "Internet Options")</li>
                                    <li>Cliquer sur l'onglet "Confidentialité" (ou "Confidentiality")</li>
                                    <li>Sélectionner le niveau souhaité à l'aide du curseur ou cliquer sur le bouton "Avancé" pour personnaliser la gestion des cookies.</li>
                                </ol>
                                <p><strong>Pour Firefox 3.5 et + :</strong></p>
                                <ol>
                                    <li>Choisir le menu "Outils" (ou "Tools"), puis "Options "</li>
                                    <li>Cliquer sur l'onglet "Vie privée"</li>
                                    <li>Dans « Règles de conservation », sélectionner « Utiliser les paramètres personnalisés pour l’historique » et décocher le bouton "Accepter les cookies".</li>
                                </ol>
                                <p><strong>Pour Chrome :</strong></p>
                                <ol>
                                    <li>Choisir le menu "Outils" (ou "Tools"), puis "Options " </li>
                                    <li>Cliquer sur l'onglet "Options avancées" </li>
                                    <li>Dans « Paramètres de contenu », cocher le bouton « Interdire à tous les sites de stocker les données».</li>
                                </ol>
                                <p><strong>Pour Netscape 6.X et 7.X :</strong></p>
                                <ol>
                                    <li>Choisir le menu "Edition">"Préférences"</li>
                                    <li>Confidentialité et Sécurité</li>
                                    <li>Cookies</li>
                                </ol>
                                <p><strong>Pour Opéra 6.0 et au-delà :</strong></p>
                                <ol>
                                    <li>Choisir le menu "Fichier">"Préférences"</li>
                                    <li>Vie Privée</li>
                                </ol>
                            </li>
                        </ul>

                        <h2>5. Fonctionnement du service</h2>
                        <p>Le service proposé sur le site <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> permet à l’utilisateur de rechercher dans les bases de données de Pôle emploi, des entreprises susceptibles de recruter des profils similaires au sien en fonction des critères qu’il a défini.</p>

                        <h2>6. Responsabilités</h2>
                        <ol>
                            <li>
                                <h3>Accessibilité et utilisation du service</h3>
                                <p>Pôle emploi ne peut être tenu pour responsable vis-à-vis de l’utilisateur des dommages de toute nature, directs ou indirects, résultant de l’utilisation du site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a>, ni de l’impossibilité d’y accéder.</p>
                            </li>
                            <li>
                                <h3>Résultats de recherche</h3>
                                <p>Pôle emploi décline toute responsabilité, envers l’utilisateur et/ou envers les entreprises ou organismes, concernant notamment :</p>
                                <ul>
                                    <li>l’absence de résultat au regard des critères définis par l’utilisateur</li>
                                    <li>la non-exhaustivité des résultats obtenus</li>
                                    <li>la présence d’erreurs dans les résultats communiqués</li>
                                    <li>le positionnement d’une entreprise dans les résultats de recherche</li>
                                    <li>le contenu et la disponibilité des sites tiers vers lesquels le site <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> renvoie.</li>
                                </ul>
                                <p>Une entreprise ou un organisme peut s’opposer à ce que son nom apparaisse dans les résultats de recherche et/ou modifier les informations communiquées sur le site <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> en remplissant le formulaire disponible via le lien présent sur la fiche la concernant.</p>
                            </li>
                        </ol>

                        <h2>7. Obligations de l'utilisateur</h2>
                        <p>L’utilisateur du site reconnaît avoir pris connaissance et accepter les présentes conditions d’utilisation avant toute utilisation du site.</p>
                        <p>L’utilisation du site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> est soumise au respect par  l’utilisateur de : la législation française, les présentes conditions d’utilisation, les conditions d’utilisation de l’Emploi store disponibles à l’adresse suivante : <a href="http://www.emploi-store.fr/portail/conditionsgeneralesutilisation">http://www.emploi-store.fr/portail/conditionsgeneralesutilisation</a>.
                            </p>
                        <p>Les présentes conditions d’utilisation peuvent être modifiées à tout moment ; la date de mise à jour est mentionnée. Ces modifications sont opposables à l’utilisateur dès leur mise en ligne sur le site internet <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a>. L’utilisateur est donc invité à consulter régulièrement la dernière version mise à jour.</p>

                        <h2>8. Propriété intellectuelle</h2>
                        <p>Le site web <a href="//labonnealternance.pole-emploi.fr">labonnealternance.pole-emploi.fr</a> est protégé au titre des dispositions relatives au droit d’auteur défini aux articles L.111-1 et suivants du code de la propriété intellectuelle et au titre des dispositions relatives aux bases de données définies aux articles L.341-1 et suivants du même code. Pôle emploi est titulaire de l’ensemble des droits de propriété intellectuelle sur les éléments composant le site et la base de données relative aux offres d’emploi.</p>
                        <p>Sans préjudice des dispositions prévues à l’article L.122-5 du code de la propriété intellectuelle, toute représentation, reproduction ou diffusion, intégrale ou partielle du site, sur quelque support que ce soit, sans l'autorisation expresse et préalable de Pôle emploi constitue un acte de contrefaçon, sanctionné au titre des articles L.335-2 et L.335.3 du même code.</p>
                        <p>Sans préjudice des dispositions prévues à l’article L.342-3 du code de la propriété intellectuelle, toute représentation, reproduction ou diffusion, intégrale ou partielle de la base de données, sur quelque support que ce soit, sans l'autorisation expresse et préalable de Pôle emploi est sanctionné au titre des articles L.343-1 et suivants du même code.</p>
                        <p>Par ailleurs, la marque Pôle emploi est protégée au titre des articles L.712-1 et suivants du code de la propriété intellectuelle. Toute représentation, reproduction ou diffusion, intégrale ou partielle de la marque Pôle emploi, sur quelque support que ce soit, sans l'autorisation expresse et préalable de Pôle emploi constitue un acte de contrefaçon, sanctionné au titre des articles L.716-1 du même code.</p>
                </main>

                <RGPDBar />

                <Footer />
            </div>
                );
            }
}