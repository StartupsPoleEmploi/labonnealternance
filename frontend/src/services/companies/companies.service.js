import { constants } from '../../constants';

import store from '../store';
import { COMPANIES_ACTIONS } from './companies.reducer';

import { NotificationService } from '../notification/notification.service';
import { RequestOccuringService } from '../requests_occuring/request_occuring.service';

class CompaniesServiceFactory {

    constructor() {
        this.PAGE_SIZE = 100;
        this.MAX_PAGE = 3; // 300 results max
    }

    applyFilters(filters) {
        store.dispatch({
            type: COMPANIES_ACTIONS.APPLY_FILTERS,
            data: { filters }
        });
    }

    computeResultTitle(companyCount, searchTerm, cityName) {
        let text = 'Voici ';

        // Company count
        if (companyCount > 1) text = text.concat('les ' + companyCount + ' entreprises qui recrutent le plus');
        else text = text.concat('la seule entreprise qui recrute');

        // Job name
        text = text.concat(' en Alternance dans le métier/domaine "'+ searchTerm +'"');

        // City name (if possible)
        if (cityName) text = text.concat(', à ').concat(cityName).concat('.');

        return text;
    }

    getCityFromSlug(citySlug) {
        let url = constants.GET_CITY_SLUG_INFORMATIONS.concat(citySlug);

        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (response.status === 200) return response.json();
                    reject();
                }).then(response => {
                    resolve(response);
                });
        });
    }

    getJobFromSlug(jobSlug) {
        let url = constants.GET_JOB_SLUG_INFORMATIONS.concat(jobSlug.trim());

        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (response.status === 200) return response.json();
                    reject();
                }).then(response => {
                    resolve(response);
                });
        });
    }

    getCompaniesFromWindowObject(jobs) {
        store.dispatch({
            type: COMPANIES_ACTIONS.ADD_COMPANIES,
            data: { companies: window.__companies.companies, jobs }
        });
        delete window.__companies; // Ensure that this content will not be re-used through navigation
    }

    getCompanies(jobs, longitude, latitude, opts) {
        let options = opts || {};

        // Create URL for LBB
        let romes = jobs.map(job => job.rome || job.rome_code).join(',')


        let url = constants.GET_COMPANIES_URL;
        url = url.concat('romes=', romes)
            .concat('&longitude=', longitude)
            .concat('&latitude=', latitude);

        let page = options.page || 1;
        if (page !== 1) { url = url.concat('&page=', page); }

        let distance = options.distance || 10;
        if (distance) { url = url.concat('&distance=', distance); }

        // Fetch result from LBB
        fetch(url)
            .then((response) => {
                // NOTE : the first addRequest(); is done in Result.getNewCompanies
                RequestOccuringService.removeRequest();
                if (response.status === 200) return response.json();

                NotificationService.createError('Erreur lors de communication avec le serveur');
            })
            .then((response) => {
                if (!response) return;

                // Extra-request if we don't have all the companies yet
                if (this.moreRequestsNeeded(page, response.companies_count)) {
                    RequestOccuringService.addRequest();
                    this.getCompanies(jobs, longitude, latitude, { page: page+1, distance });
                }

                store.dispatch({
                    type: COMPANIES_ACTIONS.ADD_COMPANIES,
                    data: { companies: response.companies, jobs }
                });
            });
    }

    clearCompanies() {
        if(store.getState().companies.size === 0) return;

        store.dispatch({
            type: COMPANIES_ACTIONS.CLEAR_COMPANIES
        });
    }

    moreRequestsNeeded(currentPage, companiesCount) {
        // Avoid too much result
        if (this.MAX_PAGE <= currentPage) return false;

        return companiesCount > currentPage * this.PAGE_SIZE;
    }
}


// Export as singleton
const companiesService = new CompaniesServiceFactory();
Object.freeze(companiesService);
export { companiesService as CompaniesService };
