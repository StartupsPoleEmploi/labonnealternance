import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SearchFormData } from '../../../services/search_form/search_form_data';
import { LocationFormStep } from '../../form/blocks/location_form_step';
import { JobFormStep } from '../../form/blocks/job_form_step';
import { SearchFormService } from '../../../services/search_form/search_form.service';

class SearchForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchForm: SearchFormService.getSearchFormValues() || new SearchFormData()
        };
    }

    isValid = () => {
        if (this.state.searchForm.hasJobs() && this.state.searchForm.hasLocation()) {
            return this.state.searchForm.location.isValid() && this.state.searchForm.areJobsValid();
        }
        return false;
    }

    handleChange = () => {
        // Force update of the component (to render the submit button)
        this.forceUpdate();
    }

    callNewSearch = () => {
        if (this.isValid()) {
            SearchFormService.saveSearchFormValues(this.state.searchForm);
            this.state.searchForm.callSearch(this.props.history);
        }
    }

    renderSubmitBlock() {
        if (!this.props.next) return null;

        return (
            <div className="submit-container">
                <button className="button go-button" disabled={this.isValid()} onClick={this.validateStep}>Valider</button>
            </div>
        );
    }

    render() {
        return (
            <div id="new-search">
                <JobFormStep searchForm={this.state.searchForm} next={this.callNewSearch} onChange={this.handleChange} compactMode={true} show />
                <LocationFormStep searchForm={this.state.searchForm} next={this.callNewSearch} onChange={this.handleChange} showSubmit={false} show />


                <div className="submit-container">
                    <button className="button go-button"  disabled={!this.isValid()} onClick={this.callNewSearch}>C'est parti !</button>
                </div>
            </div>
        );
    }
}


export default withRouter(SearchForm);