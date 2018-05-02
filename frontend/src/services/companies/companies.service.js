import { constants } from '../../constants';

import { COMPANIES_STORE } from './companies.store';
import { COMPANIES_ACTIONS } from './companies.reducer';

import { NotificationService } from '../notification/notification.service';

export class CompaniesService {

    constructor() {
        this.PAGE_SIZE = 100;
        this.MAX_PAGE = 3; // 300 results max

        this.notificationService = new NotificationService();
    }

    applyFilters(filters) {
        COMPANIES_STORE.dispatch({
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
        let url = constants.GET_CITY_SLUG_INFORMATIONS.concat('city-slug=', citySlug);

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
        let url = constants.GET_JOB_SLUG_INFORMATIONS.concat('job-slug=', jobSlug.trim());

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


    getCompanies(jobs, longitude, latitude, opts) {
        let options = opts || {};

        // Create URL for LBB
        let romes = jobs.map(job => job.rome).join(',')

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
                if (response.status === 200) return response.json();

                this.notificationService.createError('Erreur lors de communication avec le serveur');
            })
            .then((response) => {
                if (!response) return;

                // Extra-request if we don't have all the companies yet
                if (this.moreRequestsNeeded(page, response.companies_count)) {
                    this.getCompanies(jobs, longitude, latitude, { page: page+1, distance });
                }

                COMPANIES_STORE.dispatch({
                    type: COMPANIES_ACTIONS.ADD_COMPANIES,
                    data: { companies: response.companies, jobs }
                });
            });
    }

    clearCompanies() {
        COMPANIES_STORE.dispatch({
            type: COMPANIES_ACTIONS.CLEAR_COMPANIES
        });
    }

    moreRequestsNeeded(currentPage, companiesCount) {
        // Avoid too much result
        if (this.MAX_PAGE <= currentPage) return false;

        return companiesCount > currentPage * this.PAGE_SIZE;
    }
}