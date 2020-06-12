import React, { Component } from 'react';

import store from '../../../services/store';
import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import { SoftSkillsService } from '../../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyIntroduction, PrepareApplication } from '../../shared/company_details_commun/company_details_commun';
import Modal from '../../shared/modal';
import UpdateCompanyLink from '../../shared/update-company-link';
import { PhoneEmailCompany } from '../../shared/company_details_commun/company_phone_email';


export class CompanyModal extends Component {

    constructor(props) {
        super(props);

        this.hasSoftSkills = false;
        this.hasExtraInfos = false;
        this.hasScrollEventListener = false;

        this.state = {
            company: undefined,
            recruiterAccessUrl: undefined,

            coordinateTop: undefined
        };
    }

    componentDidMount() {
        // Listen to resize event
        this.companyDetailsStore = store.subscribe(() => {
            let company = store.getState().companyDetails;
            if (company) {
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
                this.hasScrollEventListener = false;
                this.setState({ company: undefined, recruiterAccessUrl: undefined });
            }
        });
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companyDetailsStore();
    }

    shouldComponentUpdate(nextProps, nextState) {
        let fields = ['searchTerm', 'company'];
        return fields.some(field => this.state[field] !== nextState[field]);
    }

    closeModal = (event) => {
        // This event will catched in companies.js (method : handleBackForwardEvent)
        window.history.back();
    }


    // RENDER
    render() {
        if (!this.state.company) return null;

        const company = this.state.company;

        return (
            <Modal title={"Détails de l'entreprise : " + company.label} onClose={this.closeModal}>
                <div>
                    <FavoriteButton company={this.state.company} />

                    <div className="modal-body">
                        <CompanyIntroduction company={company} />
                        <PrepareApplication company={company} rome={company.job.rome} />

                    </div>

                    {CompanyDetailsCommon.renderTitle(company)}
                </div>

                <PhoneEmailCompany company={company} />

                <div className="company-footer">
                    <UpdateCompanyLink recruiterAccessUrl={this.state.recruiterAccessUrl} onOpen={this.updateCoordinatesBlock} />
                </div>
            </Modal>
        );
    }
}
