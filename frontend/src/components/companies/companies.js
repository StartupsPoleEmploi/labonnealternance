import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// Components
import { Results } from './blocks/results';
import { CompanyModal } from './blocks/company_modal';
import { LoaderScreen } from './blocks/loader_screen';
import { NotificationModal } from '../shared/notification_modal/notification_modal';
import { FavoritesList } from './blocks/favorites_list';
import SearchForm from '../shared/search_form/search_form';

// Services
import { SEOService } from '../../services/seo.service';
import { CompaniesService } from '../../services/companies/companies.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { NotificationService } from '../../services/notification/notification.service';
import { FAVORITES_STORE } from '../../services/favorites/favorites.store';
import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';

import { Job } from '../../services/search_form/job';
import { formatString } from '../../services/helpers';

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

        this.state = {
            baseUrl: this.props.match.url,

            inputError: undefined,
            loading: true,

            citySlug: this.props.match.params.citySlug,
            longitude: this.props.match.params.longitude,
            latitude: this.props.match.params.latitude,
            cityName: undefined,

            jobSlugs: this.props.match.params.jobSlugs,
            jobs: [],
            searchTerm: this.props.match.params.term || '',

            mobileVersion: window.innerWidth < MOBILE_MAX_WIDTH,
            showSearchForm: false,
            showFavoritesList: false,
            favoritesNumber: 0,
            animateMagnifier: false,
        };
    }


    // Trigger when user resize the browser window
    updateDimensions() {
        if (window.innerWidth < this.MOBILE_MAX_WIDTH) {
            if (this.state.mobileVersion === false) this.setState({ mobileVersion: true });
        } else {
            if (this.state.mobileVersion === true) this.setState({ mobileVersion: false });
        }
    }

    // SEARCH_FORM
    toggleSearchForm = () => {
        let newValue = !this.state.showSearchForm;
        this.setState({ showSearchForm: newValue, showFavoritesList: false, animateMagnifier: false });
    }

    // FAVORITES
    toggleFavorites = () => {
        let newValue = !this.state.showFavoritesList;
        this.setState({ showFavoritesList: newValue, showSearchForm: false, animateMagnifier: false });
    }

    // Trigger by the map component to get companies number
    handleCompanyCount = (companyCount) => {
        if (companyCount === 0) {
            // Show form on desktop
            if (!this.state.mobileVersion) this.setState({ showSearchForm: true });
            // Animate magnifier on mobile
            else this.setState({ animateMagnifier: true });

            if (this.state.citySlug) { this.SEOService.displayNoFollow(true); }
        } else {

            // On mobile, on first result page ever : display the number of results
            let showMobileResultPopup = localStorage.getItem(SHOW_RESULT_POPUP_KEY) === null;
            if (showMobileResultPopup) {
                let message = '7 entreprises sur 10 recrutent sans déposer d\'offres d\'emploi... N\'hésitez pas à proposer votre candidature !';
                this.notificationService.createInfo(message, SHOW_RESULT_POPUP_KEY);
            }

            this.setState({ showSearchForm: false, animateMagnifier: false });
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
                let newUrl = '/details-entreprises/' + company.siret;
                if (window.location.pathname !== newUrl) window.history.pushState({ companySiret: company.siret }, '', newUrl);
                this.setState({ company });
            } else {
                window.history.pushState({}, '', this.baseUrl);
                this.setState({ company: undefined });
            }
        });

        // When a favorite is added/remove
        FAVORITES_STORE.subscribe(() => {
            let favorites = FAVORITES_STORE.getState() || [];
            this.setState({ favoritesNumber: favorites.size });
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
    }

    makeSearch() {
        // TODO => Get datas from localStorage if match between city/job Slugs

        // Get Job from slug
        if (this.state.jobSlugs) {
            let jobSlugs = this.state.jobSlugs.split('&');

            Promise
                .all(jobSlugs.map(slug => this.companiesService.getJobFromSlug(slug)))
                .then(responses => {
                    let jobs = [];

                    responses.forEach(response => {
                        jobs.push(new Job(response.job.rome_code, response.job.label, '')); // No slug needed
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
        let title = 'Contrats/Offres d\'alternance probables pour un métier/domaine {searchTerm}, à {cityName}';
        if (!this.state.citySlug) title = 'Contrats/Offres d\'alternance probables pour un métier/domaine {searchTerm}, près de votre localisation';

        return formatString(title, { searchTerm: this.state.searchTerm, cityName: this.state.cityName });
    }
    computeFavoriteClasses() {
        let classes = 'icon large-favorite';

        if (this.state.favoritesNumber) classes = classes.concat(' heart-active');
        else classes = classes.concat(' empty-heart');

        return classes;
    }
    computeMagnifierClasses() {
        let classes = 'magnifier';

        if (this.state.showSearchForm) classes = classes.concat(' active');
        if (this.state.animateMagnifier && !this.state.loading) classes = classes.concat(' animate');

        return classes;
    }
    computeTitleContainerClasses() {
        let classes = 'title-container';
        if (this.state.showSearchForm || this.state.showFavoritesList) classes = classes.concat(' open');
        return classes;
    }

    render() {
        if (this.state.inputError) {
            return (<main>Valeurs incorrectes</main>);
        }

        if (this.state.loading) {
            return (<LoaderScreen />);
        }

        return (
            <div id="companies" className={this.state.mobileVersion ? 'mobile': ''}>

                {/* TODO => Export header to a separate component */}
                <header className="header">
                    <div className="offset">&nbsp;</div>
                    <div className={this.computeTitleContainerClasses()}>
                        <div className="title">
                            <Link className="logo" to="/"><img src="/static/img/logo/logo-bleu-lba.svg" alt="Retour à l'accueil" title="Retour à l'accueil" /></Link>

                            <button className={this.computeFavoriteClasses()} onClick={this.toggleFavorites} title={this.state.toggleFavorites ? 'Fermer la liste des favoris':'Afficher la liste des favoris'}>
                                <span className={this.state.favoritesNumber === 0 ? 'empty':'not-empty'}>{this.state.favoritesNumber}</span>
                                <span className="sub">Mes favoris</span>
                            </button>

                            <button className={this.computeMagnifierClasses()} onClick={this.toggleSearchForm} title={this.state.showSearchForm ? 'Fermer le bloc de recherche':'Afficher le bloc de recherche'}>
                                <span className="sub">Recherche</span>
                            </button>
                        </div>
                        {this.state.showSearchForm ? <div className="search-form"><SearchForm /></div>: null}
                        {this.state.showFavoritesList ? <div className="favorites"><FavoritesList /></div> : null}

                    </div>
                </header>

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