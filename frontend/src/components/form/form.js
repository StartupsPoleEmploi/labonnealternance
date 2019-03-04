import React, { Component } from 'react';
import { navigate } from '@reach/router';

import Header from '../shared/header/header';

import { JobFormStep } from './blocks/job_form_step';
import { LocationFormStep } from './blocks/location_form_step';

import { Notification } from '../shared/notification/notification';

import { SearchFormData } from '../../services/search_form/search_form_data';
import { SearchFormService } from '../../services/search_form/search_form.service';
import { SEOService } from '../../services/seo.service';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';

require('./form.css');

class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            stepNumber: 2,
            searchForm: SearchFormService.getSearchFormValues() || new SearchFormData()
        };
    }

    componentDidMount() {
        SEOService.displayNoFollow(false);
        SEOService.setTitle("Trouvez votre contrat d'alternance");
    }

    sendForm = () => {
        SearchFormService.saveSearchFormValues(this.state.searchForm);
        navigate(this.state.searchForm.computeSearchUrlSearch());
        window.history.go();
    }

    nextStep = () => {
        this.setState({ step: this.state.step + 1 });
    }

    render() {
        return (
            <div id="search-form">
                <div className="container">
                    <div className="beta">&nbsp;</div>
                    <Header showOffset={false} />
                    <div className="form-step-container">
                        <Notification />
                        <JobFormStep searchForm={this.state.searchForm} next={this.nextStep} show={this.state.step === 0} />
                        <LocationFormStep searchForm={this.state.searchForm} next={this.sendForm} show={this.state.step === 1} />
                    </div>

                    <RGPDBar />
                </div>
            </div>
        );
    }

}

export default Form;