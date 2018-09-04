import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { COMPANY_DETAILS_STORE } from '../../../services/company_details/company_details.store';
import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import { SoftSkillsService } from '../../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyCoordinates, CompanyIntroduction, PrepareApplication } from '../../shared/company_details_commun/company_details_commun';

export class CompanyModal extends Component {

    constructor(props) {
        super(props);

        this.hasSoftSkills = false;
        this.hasExtraInfos = false;

        this.state = {
            company: undefined,
            recruiterAccessUrl: undefined,
            showCoordinates: false,
        };
    }

    componentDidMount() {
        this.companyDetailsStore = COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) {
                // We close the open coordinates block
                this.setState({ company, recruiterAccessUrl: CompanyDetailsService.getRecruteurAccessUrl(company.siret) });

                // Soft skills
                if (company.job && company.job.rome && !this.hasSoftSkills) {
                    this.hasSoftSkills = true;
                    SoftSkillsService.getSoftSkills(company.job.rome);
                }

                // Extra infos
                if (!this.hasExtraInfos) {
                    this.hasExtraInfos = true;
                    CompanyDetailsService.getCompanyDetailsFromLBB(company.siret);
                }
            } else {
                // Re-init values
                this.hasSoftSkills = false;
                this.hasExtraInfos = false;
                this.setState({ company: undefined, showCoordinates: false, recruiterAccessUrl: undefined });
            }
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
        // Recording event in GA
        ReactGA.event({ category: 'Company', action: 'Open coordinates block' });

        this.setState({ showCoordinates: true });
    }

    // RENDER
    renderHowToApply() {
        return (
            <div className="how-to-apply">
                <div className="flex-big">
                    {this.state.showCoordinates ? <CompanyCoordinates company={this.state.company} /> : <div className="text-center"><button className="button" onClick={this.showCoordinates}>Affichez les coordonnées</button></div>}
                    <FavoriteButton company={this.state.company} />
                </div>
            </div>
        );
    }

    render() {
        if (!this.state.company) return null;

        const company = this.state.company;

        return (
            <div className="modal">
                <div className="modal-bg">&nbsp;</div>
                <div className="modal-content">
                    <div className="actions-zone">
                        <button onClick={this.closeModal}><span className="icon close-icon">&nbsp;</span></button>
                    </div>
                    {CompanyDetailsCommon.renderTitle(company)}

                    <small className="siret">SIRET: {company.siret}</small>

                    <div className="modal-body">
                        <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                        <CompanyIntroduction company={company} />
                        <hr />

                        <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                        <PrepareApplication company={company} rome={company.job.rome} />
                        <hr />

                        {this.renderHowToApply(company)}
                    </div>

                    <div className="company-footer">
                        <a href={this.state.recruiterAccessUrl} target="blank" title="Ouverture dans une nouvelle fenêtre">C'est mon entreprise et je souhaite en modifier les informations</a>
                    </div>
                </div>

            </div>
        );
    }
}
