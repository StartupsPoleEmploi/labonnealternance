import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';


import { Loader } from '../shared/loader/loader';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';
import FavoriteButton from '../shared/favorite_button/favorite_button';

import { SEOService } from '../../services/seo.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';

import { getParameterByName } from '../../services/helpers';

import { FAVORITES_STORE } from '../../services/favorites/favorites.store';
import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { SoftSkillsService } from '../../services/soft_skills/soft_skills.service';

require('./company_details.css');

/*
FIXME : Ugly component due to some deadline issues... (A lot of duplicate code from company_modal.js)
*/
export default class CompanyDetails extends Component {
    constructor(props) {
        super(props);

        this.companyDetailsService = new CompanyDetailsService();
        this.softSkillsService = new SoftSkillsService();
        this.SEOService = new SEOService();

        this.softSkillsService.getSoftSkillsFromLocalStorage();

        this.state= {
            referer: getParameterByName('referer') || undefined,
            rome: getParameterByName('rome') || undefined,

            showCoordinates: false,
            siret: this.props.match.params.companySiret,
            company: undefined
        };
    }

    componentWillMount() {
        COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) {
                this.SEOService.displayNoFollow(false);
                this.SEOService.setTitle('Offres probables d\'alternance société ' + company.label);

                this.setState({ company });

                if (!company.hasExtraInfos()) this.companyDetailsService.getCompanyDetailsFromLBB(company.siret);

                // Get soft skills
                if (this.state.rome) {
                    if (!company.hasSoftSkills()) this.softSkillsService.getSoftSkills(this.state.rome);
                }
            } else {
                this.SEOService.displayNoFollow(true);
            }
        });

        // When a favorite is added/deleted => force update if needed
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            if (this.state.company) this.forceUpdate();
        });

        // Set canonical URL
        let canonical = window.location.origin.concat(window.location.pathname);
        this.SEOService.setCanonical(canonical);

        this.companyDetailsService.getCompanyDetailsFromLBB(this.state.siret, true);
    }


    // When user click on "Show coordinates"
    showCoordinates = () => {
        // Recording event in GA
        ReactGA.event({ category: 'Company', action: 'Open coordinates block' });

        this.setState({ showCoordinates: true });
    }

    // RENDER
    renderPrepareApplication() {
        const company = this.state.company;
        const softSkills = company.softSkills;

        if (!softSkills && this.state.rome) return <div className="loader"><Loader /></div>;

        return (
            <div className="prepare-application">
                <div className="line responsive-column">
                    { softSkills && this.state.rome ? <div className="soft-skills">
                        <h4>Connaissez-vous les qualités requises pour ce métier ?</h4>
                        <ul className="list-unstyled two-columns">
                            { softSkills.map((skill, index) => <li key={index}>- {skill}</li>)}
                        </ul>
                    </div> : null }
                    <div className="application-advices">
                        <h4>Faites une candidature spontanée efficace</h4>
                        <div>
                            <h5>1. Faites la différence</h5>
                            <p>Montrez au recruteur que vous vous intéressez à l’entreprise en faisant des recherche sur l’entreprise.</p>
                        </div>
                        <div>
                            <h5>2. Préparez votre candidature</h5>
                            <ul className="list-unstyled">
                                <li>- Utilisez les informations recueillies sur l’entreprise</li>
                                <li>- Mettez en avant vos compétences et les qualités attendues pour ce poste</li>
                                <li>- Parlez de vous : vous faites un sport collectif (foot / basket..) ? Mettez en avant votre esprit d’équipe ! Vous êtes passionné d’art ? Parlez de votre créativité !</li>
                            </ul>
                        </div>
                        <div>
                            <h5>3. Postulez maintenant !</h5>
                            <ul className="list-unstyled">
                                <li>- Aucune offre n’a été déposée, donc soyez clair sur ce que vous cherchez et votre projet</li>
                                <li>- Objet de mail clair : candidature au poste de (…) en alternance</li>
                                <li>- Présentez-vous et parlez de votre projet et expliquez à l’employeur pourquoi vous avez choisi SON entreprise</li>
                                <li>- Vérifiez que vous n’avez pas fait de faute ! </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderCompanyCoordinates() {
        const company = this.state.company;
        const address = company.address;

        if (!address) return <div className="loader"><Loader /></div>;

        return (
            <div className="company-coordinates">
                <div className="address">
                    <h4>Adresse</h4>
                    <ul className="list-unstyled">
                        <li>{address.street}</li>
                        <li>{address.city}</li>
                    </ul>
                </div>
                <div className="contact">
                    <h4>Contact</h4>
                    <ul className="list-unstyled">
                        <li><span className="icon phone">&nbsp;</span>{ company.phone ? company.phone:'Non renseigné' }</li>
                        <li><span className="icon email">&nbsp;</span>{ company.email ? company.email:'Non renseigné' }</li>
                    </ul>
                </div>
            </div>
        );
    }
    renderCompanyDetails() {
        const company = this.state.company;
        if (!this.state.company.address) return <div className="loader"><Loader /></div>;

        return (
            <div className="company">
                <div className="line column">
                    <h3>{company.label}</h3>
                    <div>{ company.nafText ? <p>{company.nafText}</p>:'' }</div>
                </div>

                <div className="line">
                    { company.officeName ? <div className="office-name"><h4>Enseigne</h4><div>{company.officeName}</div></div>: null }
                    <div className="headcount">
                        <h4>Taille</h4>
                        {company.headcount ? <p>{company.headcount}</p>:'Inconnu'}
                    </div>

                    { company.website ? <div className="hire-rate"><h4>Site Internet</h4><a href={company.website} target="_blank" title="Ouverture dans une nouvelle fenêtre">{company.website}</a></div>:'' }
                </div>
            </div>
        );
    }
    renderHowToApply() {
        return (
            <div className="line responsive-column how-to-apply">
                <div className="flex-big">
                    { this.state.showCoordinates ? this.renderCompanyCoordinates():<div className="text-center"><button className="button" onClick={this.showCoordinates}>Affichez les coordonnées</button></div> }
                </div>
            </div>
        );
    }
    render() {
        if (!this.state.company) return <Loader />;

        let company = this.state.company;

        return (
            <div id="company-details" className="max-size-1000">
                <Header showOffset={false} />


                <main className="content">
                    <div className="actions-zone">
                        { this.state.referer ? <Link to={this.state.referer} className="button small-white">Retour à la recherche</Link> : null }
                        <FavoriteButton company={company} />
                    </div>

                    <div className="modal-title">
                        <h1>{ company.label } a recruté en alternance en 2017.</h1>
                        <strong>Tentez votre chance, postulez avant que l'offre ne soit publiée !</strong>
                    </div>

                    <div className="modal-body">
                        <small className="siret">SIRET: {company.siret}</small>
                        <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                        {this.renderCompanyDetails()}
                        <hr />

                        <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                        {this.renderPrepareApplication()}
                        <hr />

                        <h2><span className="badge">3</span>Comment postuler auprès de {company.label} ?</h2>
                        {this.renderHowToApply()}
                    </div>

                    <div className="company-footer">
                        <Link to={'/acces-recruteur?siret=' + company.siret}>C'est mon entreprise et je souhaite en modifier les informations</Link>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}