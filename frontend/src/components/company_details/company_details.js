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
import { CompanyDetailsCommon } from '../shared/company_details_commun/company_details_commun';

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
    renderHowToApply() {
        return (
            <div className="line responsive-column how-to-apply">
                <div className="flex-big">
                    { this.state.showCoordinates ? CompanyDetailsCommon.renderCompanyCoordinates(this.state.company):<div className="text-center"><button className="button" onClick={this.showCoordinates}>Affichez les coordonnées</button></div> }
                </div>
            </div>
        );
    }
    render() {
        if (!this.state.company) return <Loader />;

        const company = this.state.company;

        return (
            <div id="company-details" className="max-size-1000">
                <Header showOffset={false} />


                <main className="content">
                    <div className="actions-zone">
                        { this.state.referer ? <Link to={this.state.referer} className="button small-white">Retour à la recherche</Link> : null }
                        <FavoriteButton company={company} />
                    </div>
                    {CompanyDetailsCommon.renderTitle(company)}


                    <div>
                        <small className="siret">SIRET: {company.siret}</small>
                        <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                        {CompanyDetailsCommon.renderCompanyDetails(company)}
                        <hr />

                        <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                        {CompanyDetailsCommon.renderPrepareApplication(company, this.state.rome)}
                        <hr />

                        <h2><span className="badge">3</span>Comment postuler auprès de {company.label} ?</h2>
                        {this.renderHowToApply(company)}
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