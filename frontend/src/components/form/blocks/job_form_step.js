import React, { Component } from 'react';

import { Job } from '../../../services/search_form/job';

import { NotificationService } from '../../../services/notification/notification.service';

import { AutocompleteJobService } from '../../../services/autocomplete_job/autocomplete_job.service';
import { AUTOCOMPLETE_JOB_STORE } from '../../../services/autocomplete_job/autocomplete_job.store';
import { SearchFormService } from '../../../services/search_form/search_form.service';

const PLACEHOLDER_TEXT = 'Graphiste, maçon, second de cuisine...';

export class JobFormStep extends Component {

    constructor(props) {
        super(props);

        this.autocompleteJobService = new AutocompleteJobService();
        this.searchFormService = new SearchFormService();
        this.notificationService = new NotificationService();

        // Get search form register values
        let term = ''; let jobs = [];
        if (this.props.searchForm && this.props.searchForm.jobs) {
            jobs = this.props.searchForm.jobs;
            term = this.props.searchForm.term;
        }

        this.state = {
            suggestions: [],
            jobs,
            term,
            placeholder: PLACEHOLDER_TEXT
        };
    }

    componentWillMount() {
        this.notificationService.deleteNotification();

        this.jobStoreUnsubscribeFn = AUTOCOMPLETE_JOB_STORE.subscribe(() => {

            let suggestions =  AUTOCOMPLETE_JOB_STORE.getState();
            if (suggestions.length === 0) this.removeJob();
            else {
                // Save all the jobs
                let jobs = [];
                suggestions.forEach(suggest => {
                    jobs.push(new Job(suggest.rome, suggest.label, suggest.slug));
                });
                
                this.props.searchForm.setJobs(jobs);
                this.props.searchForm.setTerm(this.state.term);
        
                if (this.props.onChange) this.props.onChange(); // Notifify parent

                // Save new job and reset form
                this.setState({ jobs });
            }

            this.setState({ suggestions });
        });
    }

    componentDidUpdate() {
        if (!this.props.show) return;
    }

    componentWillUnmount() {
        this.jobStoreUnsubscribeFn();
    }

    isValid = () => {
        if (!this.props.searchForm.jobs) return false;
        if (this.props.searchForm.jobs.length === 0) return false;
        return this.props.searchForm.areJobsValid();
    }

    // Remove/Add placeholder
    removePlaceholder = () => { this.setState({ placeholder: '' }); }
    setPlaceholder = () => { this.setState({ placeholder: PLACEHOLDER_TEXT }); }

    // Trigger when clicking on 'validate'
    validateStep = () => {
        if (!this.props.searchForm.jobs.length === 0) {
            this.notificationService.createError('Le métier renseigné nous est inconnu');
            return;
        }
        if (!this.props.searchForm.areJobsValid()) {
            this.notificationService.createError('Erreur avec le métier renseigné');
            return;
        }

        // Save values and called next step
        this.props.next();
    }

    // Trigger when filling the job input
    autocompleteJobs = (event) => {
        this.notificationService.deleteNotification();

        let term = event.target.value;
        this.setState({ term });
        if (term && term.length > 2) this.autocompleteJobService.getJobs(term);
    }

    nextIfEnter = (event) => {
        if (event.key === 'Enter') this.validateStep();
    }

    // RENDER PART
    renderSubmitBlock() {
        if (!this.props.next) return null;

        return (
            <div className="submit-container">
                <button className="button go-button" disabled={!this.isValid()} onClick={this.validateStep}>Valider</button>
            </div>
        );
    }
    render() {
        if (!this.props.show) return null;

        return (
            <div id="job-form-step">
                <h2><label htmlFor="job_input">Dans quel métier/domaine cherchez-vous ?</label></h2>

                <input id="job-input" type="text" value={this.state.term} onInput={this.autocompleteJobs} onKeyPress={this.nextIfEnter} onFocus={this.removePlaceholder}
                    onBlur={this.setPlaceholder} placeholder={this.state.placeholder} />

                {this.renderSubmitBlock()}
            </div>
        );
    }
}