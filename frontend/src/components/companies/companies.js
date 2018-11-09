import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

// Components
import { Results } from './blocks/results';
import { CompanyModal } from './blocks/company_modal';
import { LoaderScreen } from '../shared/loader/loader_screen';
import { NotificationModal } from '../shared/notification_modal/notification_modal';
import { Header } from './blocks/header/header';

// Services
import { SEOService } from '../../services/seo.service';
import { CompaniesService } from '../../services/companies/companies.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { NotificationService } from '../../services/notification/notification.service';
import { FiltersService } from '../../services/filters/filters.service';
import { SoftSkillsService } from '../../services/soft_skills/soft_skills.service';

import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { VIEWS_STORE } from '../../services/view/views.store';

import { Job } from '../../services/search_form/job';
import { formatString, unSlug, getParameterByName } from '../../services/helpers';
import { GoogleAnalyticsService } from '../../services/google_analytics.service';
import { constants } from '../../constants';

require('./companies.css');

// Constants
const SHOW_RESULT_POPUP_KEY = 'SHOW_RESULT_POPUP_KEY';

class Companies extends Component {

    constructor(props) {
        super(props);

        this.baseUrl = this.props.match.url.concat(window.location.search);

        let distance = getParameterByName('distance') || undefined;
        if (distance) {
            if (isNaN(parseInt(distance, 0))) distance = undefined;
        }

        // Get longitude,latitude & jobs from window object (and populate server-side)
        let longitude = parseFloat(this.props.match.params.longitude);
        if (isNaN(longitude) && window.longitude) longitude = window.longitude;

        let latitude = parseFloat(this.props.match.params.latitude);
        if (isNaN(latitude) && window.latitude) latitude = window.latitude;

        let defaultJobs = [];
        if(window.jobs && window.jobs.length > 0) {
            window.jobs.forEach(job => defaultJobs.push(new Job(job.rome_code, job.label, ''))); // No slug needed
        }
        // Ensure that this content will not be re-used through navigation
        delete window.jobs; delete window.latitude; delete window.longitude;


        this.state = {
            inputError: undefined,
            loading: true,

            citySlug: this.props.match.params.citySlug,
            longitude: longitude,
            latitude: latitude,
            distance: distance,
            cityName: undefined,

            jobSlugs: this.props.match.params.jobSlugs,
            jobs: defaultJobs,
            searchTerm: this.props.match.params.term || '',

            // Some Javascript action depend on the mobile
            mobileVersion: window.innerWidth < constants.MOBILE_MAX_WIDTH,
            animateMagnifier: false,
            showForm: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps) return true;

        let fields= ['inputError', 'loading', 'citySlug', 'longitude', 'latitude', 'distance', 'cityName', 'jobSlugs', 'jobs', 'searchTerm', 'mobileVersion', 'animateMagnifier', 'showForm'];

        return fields.some(field => this.state[field] !== nextState[field]);
    }

    // Trigger when user resize the browser window
    updateDimensions() {
        if (window.innerWidth < constants.MOBILE_MAX_WIDTH) {
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
            } else if (!FiltersService.isFiltersActive()) {
                // Show form on desktop (if no filter)
                this.setState({ showForm: true });
            }

            SEOService.displayNoFollow(true);
        } else {
            // On mobile, on first result page ever : display the number of results
            let showMobileResultPopup = localStorage.getItem(SHOW_RESULT_POPUP_KEY) === null && this.state.mobileVersion;
            if (showMobileResultPopup) {
                let message = CompaniesService.computeResultTitle(companyCount, this.state.searchTerm, this.state.cityName);
                NotificationService.createInfo(message, SHOW_RESULT_POPUP_KEY);
            }

            this.setState({ animateMagnifier: false, showForm: false });

            // If user is gelocated, do not index the page (priority to URLs with citySlug)
            if (this.state.citySlug) { SEOService.displayNoFollow(false); }
            else { SEOService.displayNoFollow(true); }
        }
    }

    // Handle when user use Go back / Go forward buttons
    handleBackForwardEvent(event) {
        // Handle companySiret (if in history.state)
        let company = COMPANY_DETAILS_STORE.getState();
        if (company) {
            event.preventDefault();
            event.stopPropagation();
            CompanyDetailsService.unsetCompany();
            return false;
        }

        // Native behavior
        if(window.location.pathname.startsWith('/entreprises')) {
            window.history.back();
            // Disbale pop state
            window.onpopstate = undefined;
        }

    }

    componentWillMount() {
        // Set SEO Values title
        this.setSEOValues();

        // Listen to resize event
        window.addEventListener('resize', this.updateDimensions.bind(this));

        // Listen to goBack/goForward event
        window.onpopstate = (event) => this.handleBackForwardEvent(event);

        // Check location
        let locationOk = this.state.longitude && this.state.latitude;
        if (locationOk) {
            locationOk = !isNaN(this.state.longitude) || !isNaN(this.state.latitude);
        } else {
            locationOk = this.state.citySlug !== undefined;
        }

        // Check job
        let jobOk = this.state.jobSlugs !== undefined;
        if (!jobOk && !locationOk) {
            this.setState({ inputError: true });
            return;
        } else {
            // Start search
            this.searchCity();
        }

        // Get favorites and soft skills from localStorage
        FavoritesService.getFavoritesFromLocalStorage();
        SoftSkillsService.getSoftSkillsFromLocalStorage();


        // When a company is selected
        this.companyDetailsStore = COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();

            if (company) {
                // Update URL in browser
                let referer = this.baseUrl;
                let newUrl = '/details-entreprises/' + company.siret;
                if (window.location.pathname !== newUrl) window.history.pushState({ companySiret: company.siret }, '', newUrl + "?referer=" + encodeURIComponent(referer) + "&rome=" + company.job.rome);

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

    componentWillUnmount() {
        // Unlisten to resize event
        window.removeEventListener('resize', this.updateDimensions.bind(this));

        // Unsubscribe to listeners
        this.companyDetailsStore();
        this.viewsStore();
    }

    searchCity() {
        if(!isNaN(this.state.latitude) && !isNaN(this.state.longitude)) {
            this.searchJobs();
            return;
        }

        // Get city
        if (!this.state.citySlug) {
            this.searchJobs();
        } else {
            // Get coordinates and city
            let response = CompaniesService.getCityFromSlug(this.state.citySlug);
            response.then(response => {
                this.setState({
                    latitude: response.city.latitude,
                    longitude: response.city.longitude,
                    cityName: response.city.name,
                }, this.searchJobs());
            }).catch(err => this.props.history.push('/not-found'));
        }
    }

    searchJobs() {
        // Get Job from slug
        if (this.state.jobSlugs && this.state.jobs.length === 0) {
            CompaniesService.getJobFromSlug(this.state.jobSlugs)
                .then(responseJobs => {
                    let jobs = [];
                    responseJobs.forEach(response => {
                        jobs.push(new Job(response.rome_code, response.label, '')); // No slug needed
                    });

                    // Save values
                    this.setState({ jobs });
                }).catch(err => this.props.history.push('/not-found'));
        }

    }

    // Handle SEO values
    setSEOValues() {
        // Page title
        let title = 'Offres d\'alternance probables en {searchTerm}';
        let data = { searchTerm: this.state.searchTerm };

        if (this.state.citySlug) {
            let citySlug = this.state.citySlug;
            let zipcodeIndex = citySlug.lastIndexOf('-') + 1;

            let zipcode = citySlug.substr(zipcodeIndex, citySlug.length - 1);
            let cityName = unSlug(citySlug.substr(0, zipcodeIndex - 1));
            title = 'Offres d\'alternance probables en {searchTerm} - {cityName} ({zipcode})';
            data = { searchTerm: this.state.searchTerm, cityName, zipcode };
        }

        SEOService.setTitle(formatString(title, data));


        // Handle no-follow <meta>
        if (!this.state.citySlug) {
            SEOService.displayNoFollow(this.props.noFollow);
        }
    }


    render() {
        if (this.state.inputError) {
            return (<main>Valeurs incorrectes</main>);
        }

        let { distance, longitude, latitude, jobs, searchTerm, cityName } = { ...this.state };
        if (isNaN(longitude) || isNaN(latitude) || jobs.length === 0) return (<LoaderScreen />);

        return (
            <div id="companies">
                <Header animateMagnifier={this.state.animateMagnifier} showForm={this.state.showForm} />

                <main>
                    <NotificationModal />
                    <Results distance={distance} longitude={longitude} latitude={latitude} jobs={jobs} searchTerm={searchTerm} cityName={cityName} handleCompanyCount={this.handleCompanyCount} />
                    <CompanyModal searchTerm={this.state.searchTerm} />
                </main>
            </div>
        );
    }
}

export default withRouter(Companies);
