export class GoogleAdwordsService {

    /* Event snippet for NEW - LBA - Tag Bouton - Afficher les coordonnées conversion page */
    static sendCompanyCoordinatesConversion() {
        window.gtag('event', 'conversion', {
            'send_to': 'AW-963904050/ZFjmCM7huYkBELKE0MsD',
            'transaction_id': ''
        });
    }

    /* Event snippet for NEW - LBA - Tag Bouton - Fiche entreprise conversion page */
    static sendCompanyModalConversion() {
        window.gtag('event', 'conversion', {
            'send_to': 'AW-963904050/rYLyCIWAsokBELKE0MsD',
            'transaction_id': ''
        });
    }
}