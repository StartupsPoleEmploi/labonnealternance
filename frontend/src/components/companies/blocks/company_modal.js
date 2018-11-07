import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { COMPANY_DETAILS_STORE } from '../../../services/company_details/company_details.store';
import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import { SoftSkillsService } from '../../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyCoordinates, CompanyIntroduction, PrepareApplication } from '../../shared/company_details_commun/company_details_commun';
import { GoogleAdwordsService } from '../../../services/google_adword.service';
import throttle from 'lodash/throttle';


const FOOTER_HEIGHT_DELTA = 50;

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
        this.companyDetailsStore = COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
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

        // When a favorite is added/deleted => force update if needed
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            if (this.state.company) this.forceUpdate();
        });
    }

    componentDidUpdate() {
        if(!this.hasScrollEventListener) this.initModalEventListener();
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companyDetailsStore();
        this.favoritesStore();
    }

    shouldComponentUpdate(nextProps, nextState) {
        let fields= ['searchTerm', 'company', 'showCoordinates'];
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
        GoogleAdwordsService.sendCompanyCoordinatesConversion();

        this.setState({ showCoordinates: true }, () => this.computeCoordinatesTopValue());
    }


    initModalEventListener = () => {
        let modal = document.querySelectorAll('.modal-content')[0];
        if(!modal) return null;

        modal.addEventListener("scroll", this.updateCoordinatesFn);
        this.hasScrollEventListener = true;
        this.computeCoordinatesTopValue();
    }

    computeCoordinatesTopValue = () => {
        let modal = document.querySelectorAll('.modal-content')[0];
        if(!modal) return null;

        let modalHeight = modal.offsetHeight; // Height on screen
        let modalScrollHeight = modal.scrollHeight; // Height needed for no scrolling
        let scrollTop = modal.scrollTop;
        let coordinatesHeight = document.querySelectorAll('.how-to-apply')[0].offsetHeight;

        // We got a scroll => Coordinates at bottom
        if(modalHeight < modalScrollHeight + coordinatesHeight) {
            let newTopValue = modalHeight + scrollTop - coordinatesHeight;
            // If scrollbar is near to the bottom, we decrease the top value in order to see the company footer
            if(modalHeight + scrollTop + FOOTER_HEIGHT_DELTA/2 >= modalScrollHeight) newTopValue -= FOOTER_HEIGHT_DELTA;

            this.setState({ coordinateTop: { 'position': 'absolute', 'left': 0, 'top': newTopValue } });
            this.forceUpdate();
        } else {
            // All the modal is visible ? We disabled sticky bottom
            if(this.state.coordinateTop !== undefined) {
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
            <div className="modal">
                <div className="modal-bg" onClick={this.closeModal}>&nbsp;</div>
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
