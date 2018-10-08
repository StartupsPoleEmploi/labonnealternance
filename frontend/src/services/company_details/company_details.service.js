import { constants } from '../../constants';

import { COMPANY_DETAILS_STORE } from './company_details.store';
import { COMPANY_DETAILS_ACTIONS } from './company_details.reducer';

class CompanyDetailsServiceFactory {

    setCompanySiret(siret) {
        this.getCompanyDetailsFromLBB(siret, true);
    }

    setCompany(company) {
        COMPANY_DETAILS_STORE.dispatch({
            type: COMPANY_DETAILS_ACTIONS.SET_COMPANY,
            data: company
        });
    }

    getRecruteurAccessUrl(siret) {
        return `https://labonneboite.pole-emploi.fr/informations-entreprise?origin=labonnealternance&siret=${siret}`;
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
        })
    }

    dispatch(companyData, allDetails = false) {
        COMPANY_DETAILS_STORE.dispatch({
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
        return COMPANY_DETAILS_STORE.getState();
    }

    unsetCompany() {
        COMPANY_DETAILS_STORE.dispatch({ type: COMPANY_DETAILS_ACTIONS.DELETE_COMPANY });
    }
}


// Export as singleton
const companyDetailsService = new CompanyDetailsServiceFactory();
Object.freeze(companyDetailsService);
export { companyDetailsService as CompanyDetailsService };