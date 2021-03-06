
import { formatString } from '../../services/helpers';

export class SearchFormData {

    constructor() {
        this.term = '';
        this.jobs = undefined;
        this.location = undefined;
        this.distance = undefined;
    }

    setTerm(term) { this.term = term; }
    getTerm() { return this.term; }

    setJobs(jobs) { this.jobs = jobs; }
    getJobs() { return this.jobs; }
    hasJob(rome) {
        if(this.jobs === undefined) return false;
        return this.jobs.filter(job => job.rome === rome).length > 0;
    }
    hasJobs() { return this.jobs !== undefined && this.jobs.length !== 0; }
    areJobsValid() {
        if (!this.jobs) return false;
        if (!this.jobs.length === 0) return false;

        for (let i = 0; i < this.jobs.length; i++) {
            if (!this.jobs[i].isValid()) return false;
        }
        return true;
    }

    setLocation(location) { this.location = location; }
    getLocation() { return this.location; }
    clearLocation() { this.location = undefined; }
    hasLocation() { return this.location !== undefined; }

    setDistance(distance) { this.distance = distance; }
    getDistance() { return this.distance; }

    computeSearchUrlSearch() {
        let urlJobs = this.jobs.map(job => job.slug).join(',');

        // If the search term constains a '/', Django is confused because it got a new param !
        // For example: /gestion%2Fadministrative become /gestion/administrative
        const searchTerm = this.term.replace(/\//g,' ')

        let url = '';
        if (this.location.isGeolocated) {
            url = formatString('/entreprises/{jobSlug}/{longitude}/{latitude}/{term}', {
                longitude: this.location.longitude,
                latitude: this.location.latitude,
                jobSlug: urlJobs,
                term: encodeURIComponent(searchTerm)
            })
        }
        // If user use geolocalisation
        else {
            url = formatString('/entreprises/{jobSlug}/{citySlug}/{term}', {
                citySlug: this.location.slug,
                jobSlug: urlJobs,
                term: encodeURIComponent(searchTerm)
            })
        }

        // Add distance
        if(this.distance) url = url.concat('?distance=').concat(this.distance);

        return url;
    }
}