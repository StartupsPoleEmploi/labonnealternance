import store from '../store';

import { SOFT_SKILLS_ACTIONS } from './soft_skills.reducers';
import { COMPANY_DETAILS_ACTIONS } from '../company_details/company_details.reducer';

import { constants } from '../../constants';
import { SoftSkills } from './soft_skill';


const SOFT_SKILLS_STORAGE_KEY = 'SOFT_SKILLS';

class SoftSkillsServiceFactory {


    constructor() {
        // Save soft_skills
        store.subscribe(() => {
            let softSkills = [];
            store.getState().softSkills.forEach(value => {
                softSkills.push(value)
            });
            localStorage.setItem(SOFT_SKILLS_STORAGE_KEY, JSON.stringify(softSkills))
        })
    }

    getSoftSkillsFromLocalStorage() {
        let softSkillsStored = localStorage.getItem(SOFT_SKILLS_STORAGE_KEY);
        if(softSkillsStored != null) {

            try {
                let values = JSON.parse(softSkillsStored);

                let softSkills = [];
                values.forEach(data => {
                    softSkills.push(new SoftSkills(data.rome, data.skills));
                });

                store.dispatch({
                    type: SOFT_SKILLS_ACTIONS.ADD_ALL_SOFT_SKILLS,
                    data: { softSkills }
                });

            } catch (e) {
                console.error(e);
            }
        }
    }

    getSoftSkills(rome) {
        // No request if we already have the soft skills
        let softSkillsMap = store.getState().softSkills;
        if(softSkillsMap.has(rome)) {
            store.dispatch({
                type: COMPANY_DETAILS_ACTIONS.ADD_SOFT_SKILLS,
                data: { softSkills: softSkillsMap.get(rome) }
            });
            return;
        }


        fetch(constants.GET_SOFTSKILLS_URL + rome)
            .then((response) => {
                if (response.status === 200) return response.json();
                return;
            })
            .then((softSkillsResponse) => {
                if (!softSkillsResponse) return;

                let skills = softSkillsResponse.skills;
                if (!softSkillsResponse.skills.length === 0) return;

                // We keep only skills with score > 0.5
                let softSkills =  [];
                Object.keys(skills).forEach(key => {
                    if (skills[key].score > 0.5) softSkills.push(skills[key]);
                });

                store.dispatch({
                    type: SOFT_SKILLS_ACTIONS.ADD_SOFT_SKILLS,
                    data: { rome, softSkills }
                });

                store.dispatch({
                    type: COMPANY_DETAILS_ACTIONS.ADD_SOFT_SKILLS_FROM_REQUEST,
                    data: softSkills
                });
            }).catch(err => { /* Do nothing */ });
    }
}


// Export as singleton
const softSkillsService = new SoftSkillsServiceFactory();
Object.freeze(softSkillsService);
export { softSkillsService as SoftSkillsService };