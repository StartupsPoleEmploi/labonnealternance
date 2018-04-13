import { createStore } from 'redux';

import { SOFT_SKILLS_REDUCERS } from './soft_skills.reducers';

export const SOFT_SKILLS_STORE = createStore(SOFT_SKILLS_REDUCERS);