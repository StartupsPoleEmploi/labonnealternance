import React, { Component } from 'react';
import { Loader } from '../shared/loader/loader';

import { SEOService } from '../../services/seo.service';

import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';

export default class CompanyDetails extends Component {
    constructor(props) {
        super(props);

        this.companyDetailsService = new CompanyDetailsService();
        this.SEOService = new SEOService();

        this.state= {
            siret: this.props.match.params.companySiret,
            company: undefined
        };
    }

    componentWillMount() {
        COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) {
                this.SEOService.setTitle(company.label + " - Détails de l'entreprise");
                this.setState({ company });
            }
        });


        // Set canonical URL
        let canonical = window.location.origin.concat(window.location.pathname);
        this.SEOService.setCanonical(canonical);

        this.companyDetailsService.getCompanyDetailsFromLBB(this.state.siret, true);
    }


    render() {
        if (!this.state.company) return <Loader />;

        return (JSON.stringify(this.state.company));
    }
}