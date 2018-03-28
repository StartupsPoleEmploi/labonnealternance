import { environment } from '../../environment';

import { COMPANIES_STORE } from './companies.store';
import { COMPANIES_ACTIONS } from './companies.reducer';

import { NotificationService } from '../notification/notification.service';

export class CompaniesService {

    constructor() {
        this.PAGE_SIZE = 10;
        this.MAX_PAGE = 1; // Get only the first page

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
        if (companyCount > 1) text = text.concat('les ' + companyCount + ' entreprises ');
        else text = text.concat('la seule entrprise ');

        // Job name
        text = text.concat('qui recrutent le plus en Alternance dans le métier/domaine "'+ searchTerm +'"');

        // City name (if possible)
        if (cityName) text = text.concat(', à ').concat(cityName).concat('.');

        return text;
    }

    getCityFromSlug(citySlug) {
        let url = environment.GET_CITY_SLUG_INFORMATIONS.concat('city-slug=', citySlug);

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
        let url = environment.GET_JOB_SLUG_INFORMATIONS.concat('job-slug=', jobSlug.trim());

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


    getCompanies(job, longitude, latitude, opts) {
        let options = opts || {};

        // Create URL for LBB
        let url = environment.GET_COMPANIES_URL;
        url = url.concat('rome=', job.rome)
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
                    this.getCompanies(job, longitude, latitude, { page: page+1, distance });
                }


                COMPANIES_STORE.dispatch({
                    type: COMPANIES_ACTIONS.ADD_COMPANIES,
                    data: { companies: response.companies, job }
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