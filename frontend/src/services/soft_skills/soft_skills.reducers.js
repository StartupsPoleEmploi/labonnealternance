import { SoftSkills } from './soft_skill';

export const SOFT_SKILLS_ACTIONS = {
    ADD_SOFT_SKILLS: 'ADD_SOFT_SKILLS',
    ADD_ALL_SOFT_SKILLS: 'ADD_ALL_SOFT_SKILLS',
};

export const SOFT_SKILLS_REDUCERS = (state = new Map(), action) => {

    switch (action.type) {
        case SOFT_SKILLS_ACTIONS.ADD_SOFT_SKILLS: {
            let softSkillsMap = new Map(state);

            if(!softSkillsMap.has(action.data.rome)) {
                // Extract skills
                let skills = [];
                action.data.softSkills.forEach(skill => skills.push(skill.summary));

                softSkillsMap.set(action.data.rome, new SoftSkills(action.data.rome, skills));
            }

            return softSkillsMap;
        }

        case SOFT_SKILLS_ACTIONS.ADD_ALL_SOFT_SKILLS: {
            let softSkillsMap = new Map();
            action.data.softSkills.forEach(softSkills => {
                softSkillsMap.set(softSkills.rome, softSkills);
            });
            return softSkillsMap;
        }

        default:
            return state;
    }
};