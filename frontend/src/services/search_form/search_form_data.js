
import { formatString } from '../../services/helpers';

export class SearchFormData {

    constructor() {
        this.term = '';
        this.jobs = undefined;
        this.location = undefined;
    }

    setTerm(term) { this.term = term; }
    getTerm() { return this.term; }

    setJobs(jobs) { this.jobs = jobs; }
    hasJobs() { return this.jobs !== undefined; }
    areJobsValid() {
        for(let i = 0; i < this.jobs.length; i++) {
            if(!this.jobs[i].isValid()) return false;
        }
        return true;
    }

    setLocation(location) { this.location = location; }
    getLocation() { return this.location; }
    clearLocation() { this.location = undefined; }
    hasLocation() { return this.location !== undefined; }

    callSearch(historyContext) {
        let urlJobs = this.jobs.map(job => job.slug).join('&');

        // If user use geolocalisation
        if (this.location.isGeolocated) {
            historyContext.push(
                formatString('/entreprises/{jobSlug}/{longitude}/{latitude}/{term}', {
                    longitude: this.location.longitude,
                    latitude: this.location.latitude,
                    jobSlug: urlJobs,
                    term: encodeURIComponent(this.term)
                })
            );
            return;
        }

        // If use the city auto-complete form
        historyContext.push(
            formatString('/entreprises/{jobSlug}/{citySlug}/{term}', {
                citySlug: this.location.slug,
                jobSlug: urlJobs,
                term: encodeURIComponent(this.term)
            })
        );

        historyContext.go();
    }
}