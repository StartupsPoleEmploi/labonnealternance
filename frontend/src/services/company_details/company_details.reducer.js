import { Company } from '../companies/company';
import { determineNafSection } from '../companies/naf_section';

export const COMPANY_DETAILS_ACTIONS = {
    SET_COMPANY: 'SET_COMPANY',
    DELETE_COMPANY: 'DELETE_COMPANY',

    // When we get SoftSkills from localStorage, we have SoftSkills object
    ADD_SOFT_SKILLS: 'COMPANY_DETAILS_ADD_SOFT_SKILLS',
    // When we get softSkills from an API request, we have to handle the response JSON format
    ADD_SOFT_SKILLS_FROM_REQUEST: 'ADD_SOFT_SKILLS_FROM_REQUEST',

    ADD_COMPANY_DETAILS: 'ADD_COMPANY_DETAILS',
    ADD_ALL_COMPANY_DETAILS: 'ADD_ALL_COMPANY_DETAILS',
};

export const COMPANY_DETAILS_REDUCER = (state = null, action) => {

    switch (action.type) {

        case COMPANY_DETAILS_ACTIONS.SET_COMPANY: {
            let company = action.data;
            return company.copy();
        }

        case COMPANY_DETAILS_ACTIONS.ADD_SOFT_SKILLS: {
            // Could happen when we get the informations after the modal is closed
            if (!state) return state;

            let company= state.copy();
            company.setSoftSkills(action.data.softSkills.skills);

            return company;
        }

        case COMPANY_DETAILS_ACTIONS.ADD_SOFT_SKILLS_FROM_REQUEST: {
            // Could happen when we get the informations after the modal is closed
            if (!state) return state;

            let company= state.copy();
            let softSkills = action.data.map(skill => skill.summary); // Keep only the short label
            company.setSoftSkills(softSkills);

            return company;
        }

        case COMPANY_DETAILS_ACTIONS.ADD_ALL_COMPANY_DETAILS: {
            let company = new Company(action.data.siret, action.data.job, action.data.label, action.data.longitude, action.data.latitude, action.data.address.city, action.data.distance, determineNafSection(action.data.naf), action.data.nafText, action.data.headcount);
            company.setExtraInfos(
                action.data.address,
                action.data.email,
                action.data.phone,
                action.data.officeName,
                action.data.website,
                action.data.alternance
            );
            return company;
        }

        case COMPANY_DETAILS_ACTIONS.ADD_COMPANY_DETAILS: {
            // Could happen when we get the informations after the modal is closed
            if (!state) return state;

            let company= state.copy();

            company.setExtraInfos(
                action.data.address,
                action.data.email,
                action.data.phone,
                action.data.officeName,
                action.data.website,
                action.data.alternance
            );

            return company;
        }

        case COMPANY_DETAILS_ACTIONS.DELETE_COMPANY:
            return null;

        default:
            return state;
    }
};
