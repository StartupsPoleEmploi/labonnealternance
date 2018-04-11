import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Header } from '../shared/header/header';

import { JobFormStep } from './blocks/job_form_step';
import { LocationFormStep } from './blocks/location_form_step';

import { Notification } from '../shared/notification/notification';

import { SearchFormData } from '../../services/search_form/search_form_data';
import { SearchFormService } from '../../services/search_form/search_form.service';

require('./form.css');

class Form extends Component {

    constructor(props) {
        super(props);

        this.searchFormService = new SearchFormService();

        this.state = {
            step: 0,
            stepNumber: 2,
            searchForm: this.searchFormService.getSearchFormValues() || new SearchFormData()
        };
    }

    sendForm = () => {
        this.searchFormService.saveSearchFormValues(this.state.searchForm);
        this.state.searchForm.callSearch(this.props.history);
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
                </div>
            </div>
        );
    }

}

export default withRouter(Form);