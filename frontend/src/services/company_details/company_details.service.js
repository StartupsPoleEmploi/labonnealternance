import { constants } from '../../constants';

import store from '../store';
import { COMPANY_DETAILS_ACTIONS } from './company_details.reducer';
import { isEmpty } from '../helpers';

class CompanyDetailsServiceFactory {

    setCompanySiret(siret) {
        this.getCompanyDetailsFromLBB(siret, true);
    }

    setCompany(company) {
        store.dispatch({
            type: COMPANY_DETAILS_ACTIONS.SET_COMPANY,
            data: company
        });
    }

    getRecruteurAccessUrl(siret) {
        return `https://labonneboite.pole-emploi.fr/informations-entreprise/action?siret=${siret}&origin=labonnealternance`;
    }


    initFromWindowObject() {
        let allDetails = true;
        this.dispatch(window.__companyDetails, allDetails);
        delete window.__companyDetails; // Ensure that this content will not be re-used through navigation
    }


    getCompanyDetailsFromLBB(siret, allDetails = false) {
        return new Promise((resolve, reject) => {
            fetch(constants.GET_COMPANY_DETAILS_LBB_URL + siret)
                .then(response => {
                    if (response.status === 200) return response.json();
                    // No company found
                    reject();
                    return;
                })
                .then(companyData => {
                    if (!companyData) return;
                    resolve(companyData);
                    this.dispatch(companyData, allDetails);
                });
        });
    }

    dispatch(companyData, allDetails = false) {
        store.dispatch({
            type: allDetails ? COMPANY_DETAILS_ACTIONS.ADD_ALL_COMPANY_DETAILS : COMPANY_DETAILS_ACTIONS.ADD_COMPANY_DETAILS,
            data: {
                // This elements will be used only if action = ADD_ALL_COMPANY_DETAILS
                siret: companyData.siret,
                label: companyData.name,
                longitude: companyData.lon,
                latitude: companyData.lat,
                city: companyData.city,
                distance: companyData.distance,
                nafText: companyData.naf_text,
                headcount_text: companyData.headcount_text,
                // */
                address: {
                    street: ''.concat(companyData.address.street_number, ' ', companyData.address.street_name),
                    city: ''.concat(companyData.address.zipcode, ' ', companyData.address.city)
                },
                email: companyData.email,
                phone: companyData.phone,
                officeName: companyData.raison_sociale,
                naf: companyData.naf,
                website: companyData.website
            }
        });
    }

    getCompany() {
        const companyDetails = store.getState().companyDetails;
        return isEmpty(companyDetails) ? undefined : companyDetails;
    }

    unsetCompany() {
        store.dispatch({ type: COMPANY_DETAILS_ACTIONS.DELETE_COMPANY });
    }
}


// Export as singleton
const companyDetailsService = new CompanyDetailsServiceFactory();
Object.freeze(companyDetailsService);
export { companyDetailsService as CompanyDetailsService };