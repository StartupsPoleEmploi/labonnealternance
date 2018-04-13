export class GoogleAnalyticsService {

    static handleCompanyUrl(currentUrl) {
        currentUrl = currentUrl.replace('/',''); // Remove first '/' character
        let urlSplit = currentUrl.split('/');

        // Intercept wrong URLs (modify by user for example)
        if(urlSplit.length !== 4 && urlSplit.length !== 5) return null;

        // Geolocated if length = 5 (longitude/latitude instead of citySlug)
        let isGeolocated = urlSplit.length === 5;

        let url = '/entreprises?';

        // CitySlug and geolocated
        url = url.concat('geolocated=').concat(isGeolocated);
        if(!isGeolocated) url = url.concat('&city=').concat(urlSplit[2]);

        // Job
        let jobs = urlSplit[1].split(',');
        url = url.concat("&jobs=").concat(jobs.join("&job="));

        // Search term
        let term = urlSplit[urlSplit.length - 1]
        url = url.concat('&term=').concat(term);

        return url;
    }


    static handleCompanyDetailsUrl(currentUrl) {
        currentUrl = currentUrl.replace('/',''); // Remove first '/' character
        let urlSplit = currentUrl.split('/');

        // Intercept wrong URLs (modify by user for example)
        if(urlSplit.length !== 2) return null;

        return '/details-entreprises?siret='.concat(urlSplit[1]);
    }
}