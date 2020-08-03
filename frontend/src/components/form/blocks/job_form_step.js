import React, { Component } from 'react';
import debounce from 'lodash/debounce';

import store from '../../../services/store';

import { Job } from '../../../services/search_form/job';
import { NotificationService } from '../../../services/notification/notification.service';

import { AutocompleteJobService } from '../../../services/autocomplete_job/autocomplete_job.service';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';

const PLACEHOLDER_TEXT = 'Graphiste, maçon, second de cuisine...';
const SCORE_MIN = 2
const AUTOCOMPLETE_STEP = 'autocomplete'
const JOB_SELECTION_STEP = 'jobSelection'

const JOB_SEARCH_URL = '/recherche'
const JOBS_FILTER_URL = '/recherche/filtre-metiers'
const CITY_SEARCH_URL = '/recherche/choix-ville'

const PAGE_SIZE = 10

export class JobFormStep extends Component {

    constructor(props) {
        super(props);


        this.callAutocompleteJobsFn = debounce(this.callAutocompleteJobs, 100)

        // Get search form register values
        let term = '';
        let requestNumber = 0;
        if (this.props.searchForm && this.props.searchForm.jobs) {
            term = this.props.searchForm.term;
            requestNumber = 1;
            if (term.length > 2 || term.toLocaleLowerCase() === 'rh') AutocompleteJobService.getJobs(term);
        }

        this.enterPressed = false;
        this.state = {
            term,
            requestNumber,
            placeholder: PLACEHOLDER_TEXT,
            suggestedJobs: [],
            currentPage: 0,
            showNoJobSelectedPopin: false,

            hasSubmitting: false,
            formStep: AUTOCOMPLETE_STEP
        };
    }

    componentWillMount() {
        NotificationService.deleteNotification();

        this.jobStoreUnsubscribeFn = store.subscribe(() => {

            let suggestions = store.getState().jobSuggestions;
            if (suggestions.length === 0) {
                this.setState({ requestNumber: this.state.requestNumber - 1, suggestedJobs: [] });
            } else {
                // We decrease the number of request occuring
                let requestNumber = this.state.requestNumber - 1;
                // RequestNumber can't be negative (could happen when we get datas from localStorage)
                if (this.state.requestNumber > 0) this.setState({ requestNumber });
                else if (this.state.requestNumber < 0) this.setState({ requestNumber: 0 });

                if (requestNumber <= 0) {
                    let jobs = [];
                    suggestions.forEach((suggest, index) => {
                        let score = suggest.score || 10;
                        if (score >= SCORE_MIN) jobs.push(new Job(suggest.rome, suggest.label, suggest.slug));
                    });
                    this.setState({ suggestedJobs: jobs });
                    this.props.searchForm.setTerm(this.state.term);

                    // If no request occuring and 'enter' pressed, we validate the step automatically
                    // Note : we check the number of jobs directly because setState() is not immediate
                    // so the validation in validateAutocompleteStep() is based on the last state...
                    if (this.enterPressed && jobs.length > 0) this.validateAutocompleteStep();
                }
            }
        });
    }

    componentDidUpdate() {
        if (!this.props.show) return;
    }

    componentWillUnmount() {
        // Unsubscribe to store
        this.jobStoreUnsubscribeFn();
    }

    nextIfEnter = (event) => {
        if (event.key === 'Enter') {
            // A request for suggestions is occuring, so the step will be validate after the last request
            if (this.state.requestNumber > 0) {
                this.enterPressed = true;
            } else {
                this.validateAutocompleteStep();
            }
        }
    }

    returnToAutocomplete = (event) => {
        if(!this.props.compactMode && GoogleAnalyticsService.isGASetup()) {
            GoogleAnalyticsService.setPageView(JOB_SEARCH_URL);
        }
        this.setState({ formStep: AUTOCOMPLETE_STEP });
    }

    callAutocompleteJobs = () => {
        let term = this.state.term;

        if (term && (term.length > 2 || term.toLocaleLowerCase() === 'rh')) {
            AutocompleteJobService.getJobs(term);
            this.setState({ requestNumber: this.state.requestNumber + 1 });
        }
    }

    // Trigger when filling the job input
    autocompleteJobs = (event) => {
        NotificationService.deleteNotification();
        this.setState({ hasSubmitting: false, showNoJobSelectedPopin: false });

        let term = event.target.value;
        this.setState({ term });
        if (term && (term.length > 2 || term.toLocaleLowerCase() === 'rh')) {
            this.callAutocompleteJobsFn();
        } else {
            this.props.searchForm.setJobs([]);
            this.setState({ suggestedJobs: [] });
            this.props.searchForm.setTerm('');
        }
    }


    toggleJob = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let rome = target.attributes['data-rome'].value;
        let jobs = this.props.searchForm.getJobs() || [];

        if(this.props.searchForm.hasJob(rome)) {
            // Remove the job
            jobs = jobs.filter(job => job.rome !== rome);
        } else {
            // Add the job
            let job = this.state.suggestedJobs.find(job => job.rome === rome);
            jobs.push(job);
        }

        this.props.searchForm.setJobs(jobs);
        this.setState({ showNoJobSelectedPopin: false });

        // Notifify parent (if form is include in a bigger component. Ex: new search in header)
        if (this.props.onChange) this.props.onChange();
        this.forceUpdate();
    }

    // PLACEHOLDER
    removePlaceholder = () => { this.setState({ placeholder: '' }); }
    setPlaceholder = () => { this.setState({ placeholder: PLACEHOLDER_TEXT }); }


    // VALIDATE PART
    isAutocompleteStepValid = () => {
        if (!this.state.suggestedJobs) return false;
        if (this.state.suggestedJobs.length === 0) return false;

        return true;
    }

    validateAutocompleteStep = () => {
        this.setState({ hasSubmitting: true });

        if(!this.isAutocompleteStepValid()) return;
        this.props.searchForm.setJobs([]);

        if (this.state.suggestedJobs.length === 1) {
            this.props.searchForm.setJobs(this.state.suggestedJobs);
            this.props.next();
        } else {
            // Save URL for GA
            if(!this.props.compactMode && GoogleAnalyticsService.isGASetup()) {
                GoogleAnalyticsService.setPageView(JOBS_FILTER_URL);
            }

            this.setState({ formStep: JOB_SELECTION_STEP, showNoJobSelectedPopin: false });
        }
    }

    isStepValid = () => {
        if (!this.props.searchForm.jobs) return false;
        if (this.props.searchForm.jobs.length === 0) return false;
        return this.props.searchForm.areJobsValid();
    }

    validateStep = () => {
        if (this.props.searchForm.jobs.length === 0) {
            this.setState({ showNoJobSelectedPopin: true })
            return;
        }
        if (!this.props.searchForm.areJobsValid()) {
            NotificationService.createError('Erreur avec les métiers renseignés');
            return;
        }

        // Save values and call next step
        if(this.isStepValid()) {
            // Save URL for GA
            if(!this.props.compactMode && GoogleAnalyticsService.isGASetup()) {
                GoogleAnalyticsService.setPageView(CITY_SEARCH_URL);
            }

            this.props.next();
        }
    }

    noJobFound = () => {
        const term = this.state.term;

        if(!term) return false;
        if(term.length <= 2) return false;
        if(this.state.requestNumber !== 0) return false;
        if(this.isAutocompleteStepValid()) return false;

        return true;
    }
    hideNoJobPopin = () => {
        this.setState({ hasSubmitting: false });
    }
    hideNoJobSelectedPopin = () => {
        this.setState({ showNoJobSelectedPopin: false });
    }


    // RENDER PART
    renderNotJobSelected() {
        return (
            <div className="no-job-selected-popin" role="alertdialog">
                <button className="close-container" onClick={this.hideNoJobSelectedPopin} title="Fermer le message d'erreur"><span className="icon close-icon">&nbsp;</span></button>
                Pour passer à l'étape suivante,<br />vous devez choisir au moins un métier
            </div>
        )
    }
    renderNotJobFound() {
        return (
            <div className="no-job-popin" role="alertdialog">
                <button className="close-container" onClick={this.hideNoJobPopin} title="Fermer le message d'erreur"><span className="icon close-icon">&nbsp;</span></button>
                Nous n'avons pas compris<br />le métier que vous recherchez.<br />Essayez avec une autre orthographe
            </div>
        )
    }
    renderAutocompleteBlock() {
        return (
            <div className="job-form-step">
                <h2><label htmlFor="job_input">Dans quel métier/formation/domaine cherchez-vous ?</label></h2>

                <div>
                    <input id="job-input" type="text" value={this.state.term} onChange={this.autocompleteJobs} onKeyPress={this.nextIfEnter} onFocus={this.removePlaceholder}
                        onBlur={this.setPlaceholder} placeholder={this.state.placeholder} />
                </div>

                { !this.isAutocompleteStepValid() && this.state.hasSubmitting ? this.renderNotJobFound() : null }

                {!this.props.compactMode ?
                    <div className="submit-container autocomplete-submit">
                        <button id"lba-search-step1-submit" className="button go-button" onClick={this.validateAutocompleteStep}>Valider</button>
                    </div> : null
                }
            </div>
        );
    }

    renderPagination() {
        return (
            <div className="pagination">
                { [0,1].map(page=> (<button key={page} className={ this.state.currentPage === page ? 'selected' : '' } data-page={page} onClick={this.setPage}>{page + 1}</button>)) }
            </div>
        );
    }

    renderSelectJobsBlock() {
        let showSubmit = true;
        if (this.props.compactMode !== undefined) showSubmit = !this.props.compactMode;

        // Pagination
        let begin = PAGE_SIZE * this.state.currentPage;
        const suggestedJobs = this.state.suggestedJobs.slice(begin, begin + PAGE_SIZE);

        return (
            <div className="job-form-step">
                <h2 className="small"><label htmlFor="job_input">Sélectionnez les métiers qui vous intéressent</label></h2>

                <ul className="list-unstyled">
                    { suggestedJobs.map(job => this.renderJob(job))}
                </ul>
                { this.state.suggestedJobs.length > PAGE_SIZE ? this.renderPagination() : null }
                {this.state.showNoJobSelectedPopin ? this.renderNotJobSelected() : null}

                { showSubmit ? <div className="submit-container">
                    <button className="button go-button" onClick={this.validateStep}>Valider</button>
                </div> : null }


                { !this.props.compactMode ? <button className="return" onClick={this.returnToAutocomplete}>Retour</button> : null }
            </div>
        );
    }

    renderJob(job) {
        let selected = this.props.searchForm.hasJob(job.rome);

        let label = job.label;

        return (
            <li className={selected ? 'selected' : ''} key={job.rome}>
                <button data-rome={job.rome} onClick={this.toggleJob}>
                    <span><span>{label}</span></span>
                    <span className="sr-only">{selected ? 'Choisir ce métier' : 'Retirer ce métier'}</span>
                    <span className={selected ? 'icon check-active' : 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }

    setPage = (e) => {
        let page = e.target.attributes['data-page'].value;
        this.setState({ currentPage: +page });
    }

    render() {
        if (!this.props.show) return null;

        if (this.props.compactMode) {
            return (
                <>
                    {this.renderAutocompleteBlock()}
                    {this.noJobFound() ? null : this.renderSelectJobsBlock()}
                    {this.state.showNoJobSelectedPopin ? this.renderNotJobSelected() : null }
                </>
            );
        } else {
            if (this.state.formStep === AUTOCOMPLETE_STEP) return this.renderAutocompleteBlock();
            if (this.state.formStep === JOB_SELECTION_STEP) return this.renderSelectJobsBlock();
        }
    }
}
