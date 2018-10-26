import { constants } from '../../constants';

import { NotificationService } from '../notification/notification.service';

import { AUTOCOMPLETE_JOB_STORE } from './autocomplete_job.store';
import { AUTOCOMPLETE_JOB_ACTIONS } from './autocomplete_job.reducer';

import { cleanTerm } from '../helpers';

class AutocompleteJobServiceFactory {

    getJobs(term) {
        let url = constants.SUGGEST_JOBS_URL + cleanTerm(term);
        fetch(url)
            .then(response => {
                if (response.status === 200) return response.json();
                // Error
                NotificationService.createError('Erreur lors de la récupération des métiers');
                AUTOCOMPLETE_JOB_STORE.dispatch({ type: AUTOCOMPLETE_JOB_ACTIONS.CLEAR_SUGGESTIONS });
            })
            .then(romesObjects => {
                if (!romesObjects) return;

                // Create
                AUTOCOMPLETE_JOB_STORE.dispatch({
                    type: AUTOCOMPLETE_JOB_ACTIONS.SET_SUGGESTIONS,
                    data: romesObjects
                });
            });
    }
}

// Export as singleton
const autocompleteJobService = new AutocompleteJobServiceFactory();
Object.freeze(autocompleteJobService);
export { autocompleteJobService as AutocompleteJobService };