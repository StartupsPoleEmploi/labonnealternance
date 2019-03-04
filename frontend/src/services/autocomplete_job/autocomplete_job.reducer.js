import { AutocompleteJob } from './autocomplete_job';

export const AUTOCOMPLETE_JOB_ACTIONS = {
    CLEAR_SUGGESTIONS: 'JOB_CLEAR_SUGGESTIONS',
    SET_SUGGESTIONS: 'JOB_SET_SUGGESTIONS'
};

let initialState = [];
export const AUTOCOMPLETE_JOB_REDUCER = (state = initialState, action) => {

    switch (action.type) {

        case AUTOCOMPLETE_JOB_ACTIONS.SET_SUGGESTIONS: {
            let suggestions = [];
            action.data.forEach(suggest => {
                suggestions.push(new AutocompleteJob(suggest.id, suggest.label, suggest.occupation, suggest.score));
            });
            return suggestions;
        }

        case AUTOCOMPLETE_JOB_ACTIONS.CLEAR_SUGGESTIONS:
            return [];

        default:
            return state;
    }
};