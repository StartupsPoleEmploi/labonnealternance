import { Company } from './company';
import { FILTERS_STORE } from '../filters/filters.store';
import { determineNafSection } from './naf_section';
import startsWith from 'lodash/startsWith'; // Use for IE11 compat

export const COMPANIES_ACTIONS = {
    ADD_COMPANIES: 'ADD_COMPANIES',
    CLEAR_COMPANIES: 'CLEAR_COMPANIES',
    UPDATE_COMPANY: 'UPDATE_COMPANY',
    APPLY_FILTERS: 'APPLY_FILTERS',
};

let initialState = new Map();
export const COMPANIES_REDUCER = (state = initialState, action) => {

    switch (action.type) {

        case COMPANIES_ACTIONS.ADD_COMPANIES: {
            if (action.data === undefined) return state;

            // Filters
            let filters = FILTERS_STORE.getState();
            let filtersActive = isFiltersActive(filters);

            // Note : to not check duplicates here (because distance can change)
            let companies = new Map(state);
            action.data.companies.forEach(company => {
                if (!companies.has(company.siret)) {
                    let companyTemp = new Company(company.siret, action.data.job, company.name, company.lon, company.lat, company.city, company.distance, determineNafSection(company.naf), company.naf_text, company.headcount_text);

                    if (filtersActive) companyTemp.visible = computeFilters(filters, companyTemp);
                    companies.set(company.siret, companyTemp);
                }
            });

            return companies;
        }

        case COMPANIES_ACTIONS.CLEAR_COMPANIES:
            return new Map();

        case COMPANIES_ACTIONS.APPLY_FILTERS: {
            let companies = new Map(state);

            companies.forEach((company, siret) => {
                company.visible = computeFilters(action.data.filters, company);
            });

            return companies;
        }

        default:
            return state;
    }
};


function isFiltersActive(filters) {
    for (let filter in filters) {
        if (filters[filter] !== 'all') return true;
    }
    return false;
}

function computeFilters(filters, company) {
    let visible = true;

    // By headcount
    if (filters.headcount !== 'all') {
        if (!company.headcount) visible = false;

        // At least, one headcount filter matches with company.headcount
        let hasHeadcount = false;
        for (let i = 0; i < filters.headcount.length; i++) {
            if(startsWith(company.headcount, filters.headcount[i])){
                hasHeadcount = true;
                break;
            }
        }

        if (!hasHeadcount) visible = false;
    }

    // By NAF
    if (filters.naf !== 'all' && visible) {
        visible = filters.naf.includes(company.nafSection);
    }

    // By Rome
    if (filters.rome !== 'all' && visible) {
        if (!company.job) visible = false;
        if (!company.job.rome) visible = false;


        // Note : filters.naf are already in lowercase
        let indexRome = filters.rome.indexOf(company.job.rome);
        if (indexRome === -1) visible = false;
    }


    return visible;
}