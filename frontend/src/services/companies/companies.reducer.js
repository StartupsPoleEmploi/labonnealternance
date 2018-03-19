import { Company } from './company';

export const COMPANIES_ACTIONS = {
    ADD_COMPANIES: 'ADD_COMPANIES',
    CLEAR_COMPANIES: 'CLEAR_COMPANIES',
    UPDATE_COMPANY: 'UPDATE_COMPANY',
    APPLY_FILTERS: 'APPLY_FILTERS',
};

let initialState = [];
export const COMPANIES_REDUCER = (state = initialState, action) => {

    switch (action.type) {

        case COMPANIES_ACTIONS.ADD_COMPANIES: {
            if (action.data === undefined) return state;
            let companies = state.slice();
            action.data.forEach(company => {
                companies.push(new Company(company.siret, company.name, company.lon, company.lat, company.city, company.distance, company.naf_text, company.headcount_text));
            });

            return companies;
        }

        case COMPANIES_ACTIONS.CLEAR_COMPANIES:
            return [];

        case COMPANIES_ACTIONS.APPLY_FILTERS: {
            let copy = state.slice();
            copy.forEach(company => {
                company.visible = computeFilters(action.data.filters, company);
            });
            return copy;
        }

        default:
            return state;
    }
};


function computeFilters(filters, company) {
    let visible = true;

    // By headcount
    if (filters.headcount !== 'all') {
        if (!company.headcount) visible = false;

        // At least, one headcount filter matches with company.headcount
        let hasHeadcount = false;
        for (let i = 0; i < filters.headcount.length; i++) {
            if (company.headcount.startsWith(filters.headcount[i])) {
                hasHeadcount = true;
                break;
            }
        }

        if (!hasHeadcount) visible = false;
    }

    // By NAF
    if (filters.naf !== 'all' && visible) {
        if (!company.nafText) visible = false;

        // Note : filters.naf are already in lowercase
        let indexNaf = filters.naf.indexOf(company.nafText.toLowerCase());
        if (indexNaf === -1) visible = false;
    }

    return visible;
}