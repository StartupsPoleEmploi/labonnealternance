import React, { Component } from 'react';
import { Link } from '@reach/router';
import { navigate } from '@reach/router';

import store from '../../services/store';

import { Loader } from '../shared/loader/loader';
import { Footer } from '../shared/footer/footer';
import { NotificationModal } from '../shared/notification_modal/notification_modal';

import Header from '../companies/blocks/header/header';
import FavoriteButton from '../shared/favorite_button/favorite_button';

import { SEOService } from '../../services/seo.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';

import { getParameterByName } from '../../services/helpers';

import { SoftSkillsService } from '../../services/soft_skills/soft_skills.service';
import { CompanyDetailsCommon, CompanyIntroduction, PrepareApplication } from '../shared/company_details_commun/company_details_commun';
import UpdateCompanyLink from '../shared/update-company-link';
import { PhoneEmailCompany } from '../shared/company_details_commun/company_phone_email';

require('./company_details.css');

class CompanyDetails extends Component {
    constructor(props) {
        super(props);

        SoftSkillsService.getSoftSkillsFromLocalStorage();

        let siret = this.props.companySiret;

        this.state = {
            referer: this.getReferer(),
            rome: getParameterByName('rome') || undefined,
            siret,
            company: undefined,
            recruiterAccessUrl: CompanyDetailsService.getRecruteurAccessUrl(siret)
        };
    }

    componentWillMount() {
        this.companyDetailsStore = store.subscribe(() => {
            let company = store.getState().companyDetails;
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

        // Set canonical URL
        let canonical = window.location.origin.concat(window.location.pathname);
        SEOService.setCanonical(canonical);

        // Init from window.__companyDetails or by request
        if (window.__companyDetails) {
            CompanyDetailsService.initFromWindowObject();
        } else {
            CompanyDetailsService.getCompanyDetailsFromLBB(this.state.siret, true)
                .catch(() => navigate('/not-found'));
        }
    }

    componentWillUnmount() {
        this.companyDetailsStore();
    }

    deleteCurrentCompany = () => {
        CompanyDetailsService.unsetCompany();
    }


    getReferer() {
        let referer = getParameterByName('referer') || undefined;

        if (referer) {
            // Should start with '/entreprises'
            let re = /^\/entreprises\//;
            if (!re.test(referer)) referer = '';
        }
        return referer;
    }

    // RENDER
    render() {
        if (!this.state.company) return <Loader />;

        const company = this.state.company;

        return (
            <div id="company-details" className="max-size-1000">
                <Header showOffset={false} />

                <NotificationModal />
                <main className="content">
                    <div className="actions-zone">
                        {this.state.referer ? <Link to={this.state.referer} onClick={this.deleteCurrentCompany} className="button small-white">Retour à la recherche</Link> : null}
                        <FavoriteButton company={company} />
                    </div>

                    <div>
                        <CompanyIntroduction company={company} />
                        <PrepareApplication company={company} rome={this.state.rome} />
                    </div>

                    {CompanyDetailsCommon.renderTitle(company)}

                    <PhoneEmailCompany company={company} />

                    <div className="company-footer">
                        <UpdateCompanyLink recruiterAccessUrl={this.state.recruiterAccessUrl} />
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

export default CompanyDetails;
