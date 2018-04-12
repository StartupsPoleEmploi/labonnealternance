import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

// Components
import { Results } from './blocks/results';
import { CompanyModal } from './blocks/company_modal';
import { LoaderScreen } from './blocks/loader_screen';
import { NotificationModal } from '../shared/notification_modal/notification_modal';
import { Header } from './blocks/header/header';

// Services
import { SEOService } from '../../services/seo.service';
import { CompaniesService } from '../../services/companies/companies.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { NotificationService } from '../../services/notification/notification.service';
import { FiltersService } from '../../services/filters/filters.service';
import { ViewsService } from '../../services/view/views.service';

import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { VIEWS_STORE } from '../../services/view/views.store';

import { Job } from '../../services/search_form/job';
import { formatString } from '../../services/helpers';
import { GoogleAnalyticsService } from '../../services/google_analytics.service';

require('./companies.css');

// Constants
const SHOW_RESULT_POPUP_KEY = 'SHOW_RESULT_POPUP_KEY';
const MOBILE_MAX_WIDTH = 768; // Use mobile mode at 768px
const LOADING_DURATION = 4000; // In milliseconds

class Companies extends Component {

    constructor(props) {
        super(props);

        // Set SEO values
        this.SEOService = new SEOService();
        this.companiesService = new CompaniesService();
        this.companyDetailsService = new CompanyDetailsService();
        this.favoritesService = new FavoritesService();
        this.notificationService = new NotificationService();
        this.filtersService = new FiltersService();
        this.viewService = new ViewsService();

        this.baseUrl = this.props.match.url;

        this.state = {
            inputError: undefined,
            loading: true,

            citySlug: this.props.match.params.citySlug,
            longitude: this.props.match.params.longitude,
            latitude: this.props.match.params.latitude,
            cityName: undefined,

            jobSlugs: this.props.match.params.jobSlugs,
            jobs: [],
            searchTerm: this.props.match.params.term || '',

            // Some Javascript action depend on the mobile
            mobileVersion: window.innerWidth < MOBILE_MAX_WIDTH,
            animateMagnifier: false,
            showForm: false,
        };
    }


    // Trigger when user resize the browser window
    updateDimensions() {
        if (window.innerWidth < MOBILE_MAX_WIDTH) {
            if (this.state.mobileVersion === false) {
                this.setState({ mobileVersion: true });
            }
        } else {
            if (this.state.mobileVersion === true) {
                this.setState({ mobileVersion: false });
            }
        }
    }

    // Trigger by the map component to get companies number
    handleCompanyCount = (companyCount) => {
        if (companyCount === 0) {
            // Animate magnifier on mobile
            if (this.state.mobileVersion) {
                this.setState({ animateMagnifier: true });
            } else if (!this.filtersService.isFiltersActive()) {
                // Show form on desktop (if no filter)
                this.setState({ showForm: true });
            }

            if (this.state.citySlug) { this.SEOService.displayNoFollow(true); }
        } else {
            // On mobile, on first result page ever : display the number of results
            let showMobileResultPopup = localStorage.getItem(SHOW_RESULT_POPUP_KEY) === null;
            if (showMobileResultPopup) {
                let message = this.companiesService.computeResultTitle(companyCount, this.state.searchTerm, this.state.cityName);
                this.notificationService.createInfo(message, SHOW_RESULT_POPUP_KEY);
            }

            this.setState({ animateMagnifier: false, showForm: false });
            if (this.state.citySlug) { this.SEOService.displayNoFollow(false); }
        }
    }

    // Handle when user use Go back / Go forward buttons
    handleBackForwardEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        // Handle companySiret (if in history.state)
        let companySiret;
        if (event.state) companySiret = event.state.companySiret || undefined;

        if (!companySiret) {
            this.companyDetailsService.unsetCompany();
        } else this.companyDetailsService.setCompanySiret(companySiret);

        // Handle view (if in history.state)

        return false;
    }

    componentWillMount() {
        // Listen to resize event
        window.addEventListener('resize', this.updateDimensions.bind(this));

        // Listen to goBack/goForward event
        window.onpopstate = (event) => this.handleBackForwardEvent(event);

        // Handle no-follow <meta>
        if (!this.state.citySlug) {
            this.SEOService.displayNoFollow(this.props.noFollow);
        }

        // Check location
        let locationOk = this.state.longitude && this.state.latitude;
        if (locationOk) {
            locationOk = !isNaN(this.state.longitude) || !isNaN(this.state.latitude);
        } else {
            locationOk = this.state.citySlug;
        }

        // Check job
        let jobOk = this.state.jobSlugs !== undefined;
        if (!jobOk && !locationOk) {
            this.setState({ inputError: true });
            return;
        }

        // When a company is selected
        this.companyDetailsStore = COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();

            if (company) {
                // Update URL in browser
                let referer = escape(this.baseUrl);
                let newUrl = '/details-entreprises/' + company.siret;
                if (window.location.pathname !== newUrl) window.history.pushState({ companySiret: company.siret }, '', newUrl + "?referer=" + referer + "&rome=" + company.job.rome);

                // Register event in GA
                ReactGA.pageview(GoogleAnalyticsService.handleCompanyDetailsUrl(newUrl));

                this.setState({ company });
            } else {
                window.history.pushState({}, '', this.baseUrl);

                // Register event in GA
                ReactGA.pageview(this.baseUrl);

                this.setState({ company: undefined });
            }
        });

        // When a view is selected
        this.viewsStore = VIEWS_STORE.subscribe(() => {
            this.setState({ animateMagnifier: false });
        });
    }

    componentDidMount() {
        this.makeSearch();
    }
    componentWillUnmount() {
        // Unlisten to resize event
        window.removeEventListener('resize', this.updateDimensions.bind(this));

        // Unsubscribe to listeners
        this.companyDetailsStore();
        this.viewsStore();
    }

    makeSearch() {
        // TODO => Get datas from localStorage if match between city/job Slugs

        // Get Job from slug
        if (this.state.jobSlugs) {
            this.companiesService.getJobFromSlug(this.state.jobSlugs)
                .then(responseJobs => {
                    let jobs = [];

                    responseJobs.forEach(response => {
                        jobs.push(new Job(response.rome_code, response.label, '')); // No slug needed
                    });

                    // Save values
                    this.setState({ jobs });

                    // Get location value (if needed) or init the map
                    if (!this.state.citySlug) {
                        this.initPageContent();
                    } else {
                        // Get coordinates and city
                        let response = this.companiesService.getCityFromSlug(this.state.citySlug);
                        response.then(response => {
                            this.setState({
                                latitude: response.city.latitude,
                                longitude: response.city.longitude,
                                cityName: response.city.name,
                            },
                            // Show the map and begin to search
                            () => this.initPageContent());
                        });
                    }

                });
        }
    }


    initPageContent() {
        // Get favorites from localStorage
        this.favoritesService.getFavoritesFromLocalStorage();

        // Fake loader page (goal : make the user read the message !)
        setInterval(() => this.setState({ loading: false }), LOADING_DURATION);

        // SEO values
        this.seoService = this.SEOService.setSeoValues({
            title: this.computeTitle()
        });
    }

    computeTitle() {
        let title = 'Offres d\'alternance probables en {searchTerm} - {cityName}';
        if (!this.state.citySlug) title = 'Offres d\'alternance probables en {searchTerm}';

        return formatString(title, { searchTerm: this.state.searchTerm, cityName: this.state.cityName });
    }

    render() {
        if (this.state.inputError) {
            return (<main>Valeurs incorrectes</main>);
        }

        if (this.state.loading) {
            return (<LoaderScreen />);
        }

        return (
            <div id="companies">
                <Header animateMagnifier={this.state.animateMagnifier} showForm={this.state.showForm} />

                <main>
                    <NotificationModal />
                    <Results longitude={this.state.longitude} latitude={this.state.latitude} jobs={this.state.jobs} searchTerm={this.state.searchTerm} cityName={this.state.cityName} handleCompanyCount={this.handleCompanyCount} />
                    <CompanyModal searchTerm={this.state.searchTerm} />
                </main>
            </div>
        );
    }
}

export default withRouter(Companies);
