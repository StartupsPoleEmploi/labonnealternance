import React, { Component } from 'react';

import { Job } from '../../../services/search_form/job';

import { NotificationService } from '../../../services/notification/notification.service';

import { AutocompleteJobService } from '../../../services/autocomplete_job/autocomplete_job.service';
import { AUTOCOMPLETE_JOB_STORE } from '../../../services/autocomplete_job/autocomplete_job.store';
import { SearchFormService } from '../../../services/search_form/search_form.service';

const PLACEHOLDER_TEXT = "Graphiste, maçon, second de cuisine...";

export class JobFormStep extends Component {

    constructor(props) {
        super(props);

        this.autocompleteJobService = new AutocompleteJobService();
        this.searchFormService = new SearchFormService();
        this.notificationService = new NotificationService();

        // Get search form register values
        let term = ''; let job;
        if (this.props.searchForm && this.props.searchForm.job) {
            job = this.props.searchForm.job;
            term = this.props.searchForm.job.searchTerm;
        }

        this.state = {
            suggestions: [],
            job,
            term,
            placeholder: PLACEHOLDER_TEXT
        };
    }

    componentWillMount() {
        this.notificationService.deleteNotification();

        this.jobStoreUnsubscribeFn = AUTOCOMPLETE_JOB_STORE.subscribe(() => {
            // TEMPORARY => Save the premier résultats
            let suggestions =  AUTOCOMPLETE_JOB_STORE.getState();
            if (suggestions.length === 0) this.removeJob();
            else {
                // Save the first job
                let job = new Job(suggestions[0].rome, suggestions[0].label, suggestions[0].slug, this.state.term);
                this.props.searchForm.setJob(job);
                if (this.props.onChange) this.props.onChange(); // Notifify parent

                // Save new job and reset form
                this.setState({ job });
            }
            // END TEMPORARY

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
        if (!this.props.searchForm.job) return false;
        return this.props.searchForm.job.isValid();
    }

    // Remove/Add placeholder
    removePlaceholder = () => { this.setState({ placeholder: '' }); }
    setPlaceholder = () => { this.setState({ placeholder: PLACEHOLDER_TEXT }); }

    // Trigger when clicking on 'validate'
    validateStep = () => {
        if (!this.props.searchForm.job) {
            this.notificationService.createError('Le métier renseigné nous est inconnu');
            return;
        }
        if (!this.props.searchForm.job.isValid()) {
            this.notificationService.createError('Erreur avec le métier renseigné');
            return;
        }

        // Save values and called next step
        this.props.next();
    }

    // Trigger when clicking on a job selected
    removeJob = (event) => {
        this.setState({ job: undefined });
    }

    // Trigger when clicking on a job suggestion
    addJob = (event) => {
        let rome = event.target.attributes['data-rome'].value;
        let label = event.target.attributes['data-label'].value;
        let slug = event.target.attributes['data-slug'].value;

        let job = new Job(rome, label, slug, '');
        this.props.searchForm.setJob(job);
        if (this.props.onChange) this.props.onChange(); // Notifify parent

        // Save new job and reset form
        this.setState({
            job,
            suggestions: [],
            term: ''
        });

    }


    // Trigger when filling the job input
    autocompleteJobs = (event) => {
        this.notificationService.deleteNotification();

        let term = event.target.value;
        this.setState({ term });
        if (term && term.length > 2) this.autocompleteJobService.getJobs(term);
    }


    // RENDER PART
    renderSelectedJob() {
        if (!this.state.job) return null;

        return (
            <ul className="list-unstyled">
                <li className="selected">
                    <span>{ this.state.job.label}</span>
                    <button className="close" onClick={this.removeJob}>X</button>
                </li>
            </ul>
        );
    }

    renderSuggestions() {
        if (this.state.suggestions.length === 0) return null;

        return (
            this.state.suggestions.map(occupation =>
                (<li key={occupation.rome} onClick={this.addJob} data-rome={occupation.rome} data-slug={occupation.slug} data-label={occupation.label}>
                    { occupation.label}
                </li>)
            )
        );
    }

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
                <h2><label htmlFor="job_input">Quel métier cherchez-vous ?</label></h2>

                {/* this.state.job ?
                    this.renderSelectedJob() :
                    <input id="job-input" type="text" value={this.state.term} onInput={this.autocompleteJobs} placeholder="Graphiste, maçon, second de cuisine..." />
                */}

                {/* TEMPORARY */}
                <input id="job-input" type="text" value={this.state.term} onInput={this.autocompleteJobs} onFocus={this.removePlaceholder} onBlur={this.setPlaceholder} placeholder={this.state.placeholder} />
                {/* END TEMPORARY */}

                {/* TEMPORARY : <ul className="suggestions list-unstyled">{ this.renderSuggestions()}</ul> END TEMPORARY */}

                {this.renderSubmitBlock()}
            </div>
        );
    }
}