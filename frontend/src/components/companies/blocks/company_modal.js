import React, { Component } from 'react';

import { Loader } from '../../shared/loader/loader';

import { COMPANY_DETAILS_STORE } from '../../../services/company_details/company_details.store';
import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import FavoriteButton from '../../shared/favorite_button/favorite_button';

export class CompanyModal extends Component {

    constructor(props) {
        super(props);
        this.companyDetailsService = new CompanyDetailsService();

        this.state = {
            company: undefined,
            showCoordinates: false,
        };
    }

    componentDidMount() {
        this.companyDetailsStore = COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) {
                this.setState({ company });
                if (company.job && company.job.rome) {
                    if (!company.hasSoftSkills()) this.companyDetailsService.getSoftSkills(company.job.rome);
                    if (!company.hasExtraInfos()) this.companyDetailsService.getCompanyDetailsFromLBB(company.siret);
                }
            } else this.setState({ company: undefined });
        });

        // When a favorite is added/deleted => force update if needed
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            if (this.state.company) this.forceUpdate();
        });
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companyDetailsStore();
        this.favoritesStore();
    }

    closeModal = (event) => {
        // This event will catched in companies.js (method : handleBackForwardEvent)
        window.history.back();
    }

    // When user click on "Show coordinates"
    showCoordinates = () => {
        this.setState({ showCoordinates: true });
    }

    // RENDER
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

                    { company.website ? <div className="hire-rate"><h4>Site Internet</h4><a href={company.website}>{company.website}</a></div>:'' }
                </div>
            </div>
        );
    }

    renderPrepareApplication() {
        const company = this.state.company;
        const softSkills = company.softSkills;

        if (!softSkills) return <div className="loader"><Loader /></div>;
        if (softSkills.length === 0) return null;

        return (
            <div className="prepare-application">
                <div className="line responsive-column">
                    <div className="soft-skills">
                        <h4>Connaissez-vous les qualités requises pour les métiers en {this.state.company.job.label} ?</h4>
                        <ul className="list-unstyled two-columns">
                            { softSkills.map((skill, index) => <li key={index}>- {skill}</li>)}
                        </ul>
                    </div>
                    <div className="application-advices">
                        <h4>Faîtes une candidature spontanée efficace</h4>
                        <div>
                            <h5>1. Faites la différence</h5>
                            <p>Montrez au recruteur que vous vous intéressez à l’entreprise en faisant des recherche sur l’entreprise.</p>
                        </div>
                        <div>
                            <h5>2. Préparez votre candidature</h5>
                            <ul className="list-unstyled">
                                <li>- Utiliser les informations recueillies sur l’entreprise</li>
                                <li>- Mettez en avant vos compétences et les qualités attendues pour ce poste</li>
                                <li>- Parlez de vous : vous faites un sport collectif (foot / basket..) ? Mettez en avant votre esprit d’équipe ! Vous êtes passionné d’art ? Parlez de votre créativité !</li>
                            </ul>
                        </div>
                        <div>
                            <h5>3. Postulez maintenant !</h5>
                            <ul className="list-unstyled">
                                <li>- Aucune offre n’a été déposée, donc soyez clair sur ce que vous cherchez et votre projet</li>
                                <li>- Objet de mail clair : candidature au poste de (…) en alternance</li>
                                <li>- Présentez vous et parlez de votre projet et expliquer à l’employeur pourquoi vous avez choisi SON entreprise</li>
                                <li>- Vérifiez que vous n’avez pas fait de fautes ! </li>
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
        if (!this.state.company) return null;

        let company = this.state.company;

        return (
            <div className="modal">
                <div className="modal-bg">&nbsp;</div>
                <div className="modal-content">
                    <div className="actions-zone">
                        <FavoriteButton company={company} />
                        <button onClick={this.closeModal}><span className="icon close-icon">&nbsp;</span></button>
                    </div>

                    <div className="modal-title">
                        <h1>{ company.label } a recruté en alternance dans le secteur {this.state.company.job.label} en 2017.</h1>
                        <strong>Tentez votre chance, postulez avant que l'offre ne soit publiée !</strong>

                    </div>

                    <div className="modal-body">
                        <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                        {this.renderCompanyDetails()}
                        <hr />

                        <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                        {this.renderPrepareApplication()}
                        <hr />

                        <h2><span className="badge">3</span>Comment postuler auprès de {company.label} ?</h2>
                        {this.renderHowToApply()}
                    </div>
                </div>
            </div>
        );
    }
}