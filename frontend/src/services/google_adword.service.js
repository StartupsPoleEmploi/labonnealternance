export class GoogleAdwordsService {

    /**
     * IMPORTANT - To use GoogleAdword, you have to include this code in index.html
     * See : - https://github.com/StartupsPoleEmploi/labonnealternance/pull/58
     *       - https://github.com/StartupsPoleEmploi/labonnealternance/pull/59
     * Note: this script will add some cookies in the site (especially the CONSENT cookie which last... 20 YEARS !)
     *
     *   <!-- Global site tag (gtag.js) - Google Ads: 963904050 -->
     *   <script async src="https://www.googletagmanager.com/gtag/js?id=AW-963904050"></script>
     *  <script>
     *      window.dataLayer = window.dataLayer || [];
     *      function gtag() { dataLayer.push(arguments); }
     *      gtag('js', new Date());
     *      gtag('config', 'AW-963904050');
     *  </script>
     *
     */

    /* Event snippet for NEW - LBA - Tag Bouton - Afficher les coordonnées conversion page */
    static sendCompanyCoordinatesConversion() {
        window.gtag('event', 'conversion', {
            send_to: 'AW-963904050/ZFjmCM7huYkBELKE0MsD',
            transaction_id: ''
        });
    }

    /* Event snippet for NEW - LBA - Tag Bouton - Fiche entreprise conversion page */
    static sendCompanyModalConversion() {
        window.gtag('event', 'conversion', {
            send_to: 'AW-963904050/rYLyCIWAsokBELKE0MsD',
            transaction_id: ''
        });
    }
}