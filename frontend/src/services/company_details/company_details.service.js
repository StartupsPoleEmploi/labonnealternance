import { constants } from '../../constants';

import { COMPANY_DETAILS_STORE } from './company_details.store';
import { COMPANY_DETAILS_ACTIONS } from './company_details.reducer';

export class CompanyDetailsService {

    setCompanySiret(siret) {
        this.getCompanyDetailsFromLBB(siret, true);
    }

    setCompany(company) {
        COMPANY_DETAILS_STORE.dispatch({
            type: COMPANY_DETAILS_ACTIONS.SET_COMPANY,
            data: company
        });
    }


    getSoftSkills(rome) {
        fetch(constants.GET_SOFTSKILLS_URL + rome)
            .then((response) => {
                if (response.status === 200) return response.json();
                return;
            })
            .then((softSkills) => {
                if (!softSkills) return;

                let skills = softSkills.skills;
                if (!softSkills.skills.length === 0) return;

                // We keep only skills with score > 0.5
                let bestSkills =  [];
                Object.keys(skills).forEach(key => {
                    if (skills[key].score > 0.5) bestSkills.push(skills[key]);
                });

                COMPANY_DETAILS_STORE.dispatch({
                    type: COMPANY_DETAILS_ACTIONS.ADD_SOFT_SKILLS,
                    data: bestSkills
                });
            });
    }

    getCompanyDetailsAsPromise(siret) {
        return new Promise((resolve, reject) => {
            fetch(constants.GET_COMPANY_DETAILS_LBB_URL + siret)
                .then(response => {
                    if (response.status === 200) return response.json();
                }).then(companyData => {
                    if (!companyData) return;
                    resolve(companyData);
                });
        });
    }

    getCompanyDetailsFromLBB(siret, allDetails = false)  {
        fetch(constants.GET_COMPANY_DETAILS_LBB_URL + siret)
            .then(response => {
                if (response.status === 200) return response.json();
            }).then(companyData => {
                if (!companyData) return;

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
                        naf_text: companyData.naf_text,
                        headcount_text: companyData.headcount_text,
                        // */
                        address: {
                            street: ''.concat(companyData.address.street_number,' ', companyData.address.street_name),
                            city: ''.concat(companyData.address.zipcode, ' ', companyData.address.city)
                        },
                        email: companyData.email,
                        phone: companyData.phone,
                        officeName: companyData.office_name,
                        naf: companyData.naf_text,
                        website: companyData.website
                    }
                });
            });
    }

    getCompany() {
        return COMPANY_DETAILS_STORE.getState();
    }

    unsetCompany() {
        COMPANY_DETAILS_STORE.dispatch({ type: COMPANY_DETAILS_ACTIONS.DELETE_COMPANY });
    }
}