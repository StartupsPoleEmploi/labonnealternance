import React, { Component } from 'react';
import ReactGA from 'react-ga';

import store from '../../../services/store';
import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import { SoftSkillsService } from '../../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyCoordinates, CompanyIntroduction, PrepareApplication } from '../../shared/company_details_commun/company_details_commun';
import throttle from 'lodash/throttle';
import Modal from '../../shared/modal';
import UpdateCompanyLink from '../../shared/update-company-link';


export class CompanyModal extends Component {

    constructor(props) {
        super(props);

        this.hasSoftSkills = false;
        this.hasExtraInfos = false;
        this.hasScrollEventListener = false;

        // Throttle — invokes function at most once per every X milliseconds.
        this.updateCoordinatesFn = throttle(this.computeCoordinatesTopValue, 100);

        this.state = {
            company: undefined,
            recruiterAccessUrl: undefined,
            showCoordinates: false,

            coordinateTop: undefined
        };
    }

    componentDidMount() {
        // Listen to resize event
        this.companyDetailsStore = store.subscribe(() => {
            let company = store.getState().companyDetails;
            if (company) {
                this.setState({ company, recruiterAccessUrl: CompanyDetailsService.getRecruteurAccessUrl(company.siret) }, () => this.computeCoordinatesTopValue());

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
                this.setState({ company: undefined, showCoordinates: false, recruiterAccessUrl: undefined });
            }
        });
    }

    componentDidUpdate() {
        if (!this.hasScrollEventListener) this.initModalEventListener();
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companyDetailsStore();
    }

    shouldComponentUpdate(nextProps, nextState) {
        let fields = ['searchTerm', 'company', 'showCoordinates'];
        return fields.some(field => this.state[field] !== nextState[field]);
    }

    closeModal = (event) => {
        // This event will catched in companies.js (method : handleBackForwardEvent)
        window.history.back();
    }

    // When user click on "Show coordinates"
    showCoordinates = () => {
        // Recording event in GA
        ReactGA.event({ category: 'Company', action: 'Open coordinates block' });

        this.setState({ showCoordinates: true }, () => this.computeCoordinatesTopValue());
    }


    initModalEventListener = () => {
        let modal = document.querySelectorAll('.modal-content')[0];
        if (!modal) return null;

        modal.addEventListener("scroll", this.updateCoordinatesFn);
        this.hasScrollEventListener = true;
        this.computeCoordinatesTopValue();
    }

    computeCoordinatesTopValue = () => {
        let modal = document.querySelectorAll('.modal-content')[0];
        if (!modal) return null;

        let modalHeight = modal.offsetHeight; // Height on screen
        let modalScrollHeight = modal.scrollHeight; // Height needed for no scrolling
        let scrollTop = modal.scrollTop;
        let coordinatesHeight = document.querySelectorAll('.how-to-apply')[0].offsetHeight;

        // We got a scroll => Coordinates at bottom
        if (modalHeight < modalScrollHeight + coordinatesHeight) {
            let newTopValue = modalHeight + scrollTop - coordinatesHeight;
            // If scrollbar is near to the bottom, we decrease the top value in order to see the company footer
            let footerHeight = document.querySelector('.company-footer').offsetHeight;
            if (modalHeight + scrollTop + footerHeight / 2 >= modalScrollHeight) newTopValue -= footerHeight;

            this.setState({ coordinateTop: { 'position': 'absolute', 'left': 0, 'top': newTopValue } });
            this.forceUpdate();
        } else {
            // All the modal is visible ? We disabled sticky bottom
            if (this.state.coordinateTop !== undefined) {
                this.setState({ coordinateTop: undefined });
                this.forceUpdate();
            }
        }
    }

    // RENDER
    renderHowToApply() {
        return (
            <div className="how-to-apply" style={this.state.coordinateTop}>
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
            <Modal title={"Détails de l'entreprise : " + company.name } onClose={this.closeModal}>
                {CompanyDetailsCommon.renderTitle(company)}

                <small className="siret">SIRET: {company.siret}</small>

                <div className="modal-body">
                    <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                    <CompanyIntroduction company={company} />
                    <hr />

                    <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                    <PrepareApplication company={company} rome={company.job.rome} />

                    {this.renderHowToApply(company)}
                </div>

                <div className="company-footer">
                    <UpdateCompanyLink recruiterAccessUrl={this.state.recruiterAccessUrl} onOpen={this.updateCoordinatesBlock}/>
                </div>
            </Modal>
        );
    }
}
