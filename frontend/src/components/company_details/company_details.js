import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';


import { Loader } from '../shared/loader/loader';
import { Footer } from '../shared/footer/footer';
import { NotificationModal } from '../shared/notification_modal/notification_modal';

import { Header } from '../companies/blocks/header/header';
import FavoriteButton from '../shared/favorite_button/favorite_button';

import { SEOService } from '../../services/seo.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';

import { getParameterByName } from '../../services/helpers';

import { FAVORITES_STORE } from '../../services/favorites/favorites.store';
import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { SoftSkillsService } from '../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyCoordinates, CompanyIntroduction, PrepareApplication } from '../shared/company_details_commun/company_details_commun';
import { GoogleAdwordsService } from '../../services/google_adword.service';
import UpdateCompanyLink from '../shared/update-company-link';

require('./company_details.css');

class CompanyDetails extends Component {
    constructor(props) {
        super(props);

        SoftSkillsService.getSoftSkillsFromLocalStorage();

        let siret = this.props.match.params.companySiret;

        this.state = {
            referer: this.getReferer(),
            rome: getParameterByName('rome') || undefined,

            showCoordinates: false,
            siret: siret,
            company: undefined,
            recruiterAccessUrl: CompanyDetailsService.getRecruteurAccessUrl(siret)
        };
    }

    componentWillMount() {
        COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) {
                SEOService.displayNoFollow(false);
                SEOService.setTitle('Offres probables d\'alternance société ' + company.label);

                this.setState({ company });

                if (!company.hasExtraInfos()) CompanyDetailsService.getCompanyDetailsFromLBB(company.siret);

                // Get soft skills
                if (this.state.rome) {
                    if (!company.hasSoftSkills()) SoftSkillsService.getSoftSkills(this.state.rome);
                }
            } else {
                SEOService.displayNoFollow(true);
            }
        });

        // When a favorite is added/deleted => force update if needed
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            if (this.state.company) this.forceUpdate();
        });

        // Set canonical URL
        let canonical = window.location.origin.concat(window.location.pathname);
        SEOService.setCanonical(canonical);

        // Init from window.__companyDetails or by request
        if (window.__companyDetails) {
            CompanyDetailsService.initFromWindowObject();
        } else {
            CompanyDetailsService.getCompanyDetailsFromLBB(this.state.siret, true)
                .catch(() => {
                    this.props.history.push('/not-found');
                    this.props.history.go();
                });
        }
    }


    getReferer() {
        let referer = getParameterByName('referer') || undefined;

        if (referer) {
            // Should start with '/entreprises'
            let re = /^\/entreprises\//;
            if (!re.test(referer)) referer = "";
        }
        return referer;
    }

    // When user click on "Show coordinates"
    showCoordinates = () => {
        // Recording event in GA
        ReactGA.event({ category: 'Company', action: 'Open coordinates block' });
        GoogleAdwordsService.sendCompanyCoordinatesConversion();

        this.setState({ showCoordinates: true });
    }

    // RENDER
    renderHowToApply() {
        return (
            <div className="line responsive-column how-to-apply">
                <div className="flex-big">
                    {this.state.showCoordinates ? <CompanyCoordinates company={this.state.company} /> : <div className="text-center"><button className="button" onClick={this.showCoordinates}>Affichez les coordonnées</button></div>}
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

                <NotificationModal />
                <main className="content">
                    <div className="actions-zone">
                        {this.state.referer ? <Link to={this.state.referer} className="button small-white">Retour à la recherche</Link> : null}
                        <FavoriteButton company={company} />
                    </div>
                    {CompanyDetailsCommon.renderTitle(company)}

                    <small className="siret">SIRET: {company.siret}</small>

                    <div>
                        <h2><span className="badge">1</span>Informez-vous sur l'entreprise</h2>
                        <CompanyIntroduction company={company} />
                        <hr />

                        <h2><span className="badge">2</span>Préparez votre candidature spontanée</h2>
                        <PrepareApplication company={company} rome={this.state.rome} />
                        <hr />

                        <h2><span className="badge">3</span>Comment postuler auprès de {company.label} ?</h2>
                        {this.renderHowToApply(company)}
                    </div>

                    <div className="company-footer">
                        <UpdateCompanyLink recruiterAccessUrl={this.state.recruiterAccessUrl} />
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

export default withRouter(CompanyDetails);
