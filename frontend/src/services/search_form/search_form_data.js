
import { formatString } from '../../services/helpers';

export class SearchFormData {

    constructor() {
        this.job = undefined;
        this.location = undefined;
    }

    setJob(job) { this.job = job; }
    hasJob() { return this.job !== undefined; }

    setLocation(location) { this.location = location; }
    getLocation() { return this.location; }
    clearLocation() { this.location = undefined; }
    hasLocation() { return this.location !== undefined; }

    callSearch(historyContext) {
        // If user use geolocalisation
        if (this.location.isGeolocated) {
            historyContext.push(
                formatString('/entreprises/{jobSlug}/{longitude}/{latitude}', {
                    longitude: this.location.longitude,
                    latitude: this.location.latitude,
                    jobSlug: this.job.slug,
                })
            );
            return;
        }

        // If use the city auto-complete form
        historyContext.push(
            formatString('/entreprises/{citySlug}/{jobSlug}', {
                citySlug: this.location.slug,
                jobSlug: this.job.slug,
            })
        );

        historyContext.go();
    }
}
