import { environment } from '../../environment';

import { NotificationService } from '../notification/notification.service';

import { AUTOCOMPLETE_JOB_STORE } from './autocomplete_job.store';
import { AUTOCOMPLETE_JOB_ACTIONS } from './autocomplete_job.reducer';

import { cleanTerm } from '../helpers';

export class AutocompleteJobService {

    constructor() {
        this.notificationService = new NotificationService();
    }

    getJobs(term) {
        fetch(environment.SUGGEST_JOBS_URL + cleanTerm(term))
            .then(response => {
                if (response.status === 200) return response.json();

                // Error
                this.notificationService.createError('Erreur lors de la récupération des métiers');
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