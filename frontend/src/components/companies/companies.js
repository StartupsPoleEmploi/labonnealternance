import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { environment } from '../../environment';

import { Map } from './blocks/map';
import { CompanyModal } from './blocks/company_modal';
import { LoaderScreen } from './blocks/loader_screen';
import { MobileResultPopup } from './blocks/mobile_result_popup';

import { SEOService } from '../../services/seo.service';
import { COMPANY_DETAILS_STORE } from '../../services/company_details/company_details.store';
import { CompaniesService } from '../../services/companies/companies.service';
import { CompanyDetailsService } from '../../services/company_details/company_details.service';
import { formatString } from '../../services/helpers';
import { FavoritesService } from '../../services/favorites/favorites.service';

import SearchForm from '../shared/search_form/search_form';


require('./companies.css');

const SHOW_RESULT_POPUP_KEY = 'SHOW_RESULT_POPUP_KEY';

class Companies extends Component {

    constructor(props) {
        super(props);

        // Set SEO values
        this.SEOService = new SEOService();
        this.companiesService = new CompaniesService();
        this.companyDetailsService = new CompanyDetailsService();
        this.favoritesService = new FavoritesService();

        this.companiesUrl = environment.GET_COMPANIES_URL;

        // Use mobile mode at 768px
        this.mobileVersionBreakPoint = 768;

        // Loading page duration (in millisecond)
        this.loadingPageDuration = 4000;

        this.state = {
            baseUrl: this.props.match.url,

            company: undefined,
            inputError: undefined,
            loading: true,

            citySlug: this.props.match.params.citySlug,
            longitude: this.props.match.params.longitude,
            latitude: this.props.match.params.latitude,
            cityName: undefined,

            jobSlug: this.props.match.params.jobSlug,
            rome: this.props.match.params.rome,
            jobName: undefined,

            mobileVersion: window.innerWidth < this.mobileVersionBreakPoint,
            showSearchForm: false,
            animateMagnifier: false,

            showMobileResultPopup: false,
            mobileResultPopupMessage: '',
        };
    }

    // Trigger when user resize the browser window
    updateDimensions() {
        if (window.innerWidth < this.mobileVersionBreakPoint) {
            if (this.state.mobileVersion === false) this.setState({ mobileVersion: true });
        } else {
            if (this.state.mobileVersion === true) this.setState({ mobileVersion: false });
        }
    }

    toggleSearchForm = () => {
        let newValue = !this.state.showSearchForm;
        this.setState({ showSearchForm: newValue, animateMagnifier: false });
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
            let newState = { showSearchForm: false, animateMagnifier: false };

            // On mobile, on first result page ever : display the number of results
            let showMobileResultPopup = this.state.mobileVersion && localStorage.getItem(SHOW_RESULT_POPUP_KEY) === null;
            if (showMobileResultPopup) {
                newState.showMobileResultPopup = showMobileResultPopup;
                newState.mobileResultPopupMessage = this.companiesService.computeResultTitle(companyCount, this.state.jobName, this.state.cityName);
            }

            this.setState(newState);
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
        let jobOk = this.state.jobSlug !== undefined;

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
        if (this.state.jobSlug) {
            let response = this.companiesService.getJobFromSlug(this.state.jobSlug);
            response.then(response => {
                // Set Job Values
                this.setState({
                    rome: response.job.rome_code,
                    jobName: response.job.label,
                    loading: this.state.citySlug,
                });

                // Get location value (if needed) either init the map
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
        setInterval(() => this.setState({ loading: false }), this.loadingPageDuration);

        // SEO values
        this.seoService = this.SEOService.setSeoValues({
            title: this.computeTitle()
        });
    }

    closeMobileResultPopup = () => {
        // Create a key in localStorage to ensure that the popup will never be display again
        this.setState({ showMobileResultPopup: false });
        localStorage.setItem(SHOW_RESULT_POPUP_KEY,'');
    }

    computeTitle() {
        let title = 'Contrats d\'alternance probables pour un métier de {jobName}, à {cityName}';
        if (!this.state.citySlug) title = 'Contrats d\'alternance probables pour un métier de {jobName}, près de votre localisation';

        return formatString(title, { jobName: this.state.jobName, cityName: this.state.cityName });
    }
    computeMagnifierClasses() {
        let classes = 'magnifier';

        if (this.state.showSearchForm) classes = classes.concat(' active');
        if (this.state.animateMagnifier && !this.state.loading) classes = classes.concat(' animate');

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

                <header className="header">
                    <div className="offset">&nbsp;</div>
                    <div className="title-container">
                        <div className="title">
                            <Link className="logo" to="/"><img src="/static/img/logo/logo-bleu-lba.svg" alt="Retour à l'accueil" title="Retour à l'accueil" /></Link>
                            <button className={this.computeMagnifierClasses()} onClick={this.toggleSearchForm} title={this.state.showSearchForm ? 'Fermer le bloc de recherche':'Afficher le bloc de recherche'}>&nbsp;</button>
                        </div>
                        <div className="search-form">
                            {this.state.showSearchForm ? <SearchForm />: null}
                        </div>
                    </div>
                </header>
                <main>
                    { this.state.showMobileResultPopup ? <MobileResultPopup onClose={this.closeMobileResultPopup} message={this.state.mobileResultPopupMessage} /> : null }
                    <Map longitude={this.state.longitude} latitude={this.state.latitude} rome={this.state.rome} jobName={this.state.jobName} cityName={this.state.cityName} handleCompanyCount={this.handleCompanyCount} />
                    { this.state.company ? <CompanyModal rome={this.state.rome} jobName={this.state.jobName} /> : null }
                </main>
            </div>
        );
    }
}

export default withRouter(Companies);