import { environment } from '../environment';
import { GoogleAnalyticsService } from './google_analytics.service';

const RGPD_CONSENT = 'RGPD_CONSENT';
const RGPD_DATE = 'RGPD_DATE';

export default class RGPDService {

    static userAcceptsRGPD() {
        if(RGPDService.shouldDisplayRGPD() === true) return false;
        let userResponse = localStorage.getItem(RGPD_CONSENT);
        return userResponse === 'true';
    }

    static shouldDisplayRGPD() {
        if(localStorage.getItem(RGPD_CONSENT) === null) return true;
        if(!localStorage.getItem(RGPD_DATE) === null) return true;

        let dateSaved = localStorage.getItem(RGPD_DATE);
        if(isNaN(Date.parse(dateSaved))) return true;

        let date = new Date(dateSaved)
        let expirationDate = new Date(dateSaved);
        expirationDate.setFullYear(date.getFullYear() + 1);

        return new Date() >= expirationDate;
    }

    static setRGPDConsent(userReponse, reload=false) {
        localStorage.setItem(RGPD_CONSENT, userReponse);
        localStorage.setItem(RGPD_DATE, new Date());

        if(userReponse === true) {
            // TODO : serviceGA & serviceHotjar => init
            GoogleAnalyticsService.initGoogleAnalytics();
        } else {
            // Reload the page : GA and hotjar will not installed after
            if(reload) window.location = environment.HOME_PAGE;
        }
    }
}
