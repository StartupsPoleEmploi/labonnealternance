import React, { Component } from 'react';
import { Loader } from '../shared/loader/loader';

import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';

export default class CompanyDetails extends Component {
    constructor(props) {
        super(props);

        this.companyDetailsService = new CompanyDetailsService();

        this.state= {
            siret: this.props.match.params.companySiret,
            company: undefined
        };
    }

    componentWillMount() {
        COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company) this.setState({ company });
        });

        this.companyDetailsService.getCompanyDetailsFromLBB(this.state.siret, true);
    }


    render() {
        if (!this.state.company) return <Loader />;

        return (JSON.stringify(this.state.company));
    }
}