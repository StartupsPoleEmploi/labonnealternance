import { SearchFormData } from './search_form_data';
import { Job } from './job';
import { Location } from './location';

const SEARCH_FORM_DATA = 'SEARCH_FORM_DATA';

export class SearchFormService {

    saveSearchFormValues(searchForm) {
        localStorage.setItem(SEARCH_FORM_DATA, JSON.stringify(searchForm));
    }

    getSearchFormValues() {
        let rawValues = localStorage.getItem(SEARCH_FORM_DATA);
        if (!rawValues) return undefined;

        try {
            let values = JSON.parse(rawValues);
            let searchForm = new SearchFormData();

            searchForm.setTerm(values.term);

            let jobs = [];
            values.jobs.forEach(job => {
                jobs.push(new Job(job.rome, job.label, job.slug));
            });
            searchForm.setJobs(jobs);

            searchForm.setLocation(new Location(values.location.label, values.location.zipcode, values.location.slug, values.location.longitude, values.location.latitude, values.location.isGeolocated));
            return searchForm;
        } catch (e) {
            console.error(e);
        }

        return undefined;
    }

}