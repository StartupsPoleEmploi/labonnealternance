import React, { useState } from 'react';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';


export const PhoneEmailCompany = ({ company }) => {

    const [phoneVisible, setPhoneVisible] = useState(false);
    const [emailVisible, setEmailVisible] = useState(false);

    const phoneExists = !!company.phone;
    const emailExists = !!company.email;

    // PHONE
    function renderPhoneLink() {
        let url = `http://google.fr/search?q=${company.officeName}`;
        if(company.address) url = url.concat('+', company.address.city);

        return (
            <a href={url} rel="noopener noreferrer" onClick={showPhoneLink} className="modal-button white" target="_blank" aria-label="Recherche le numéro de téléphone sur Google (ouverture d'une nouvelle fenêtre)">
                <span className="icon icon-phone hide-mobile" aria-hidden="true"></span>
                <span className="hide-mobile">Voir le numéro</span>
                <span className="hide-tablet hide-desktop">N° de téléphone</span>
            </a>
        );
    }
    function renderPhoneButton() {
        return (
            <button onClick={showPhoneButton} className="modal-button white" aria-label="Voir le numéro de téléphone">
                <span className="icon icon-phone hide-mobile" aria-hidden="true"></span>
                <span className="hide-mobile">Voir le numéro</span>
                <span className="hide-tablet hide-desktop">N° de téléphone</span>
            </button>
        );
    }
    function showPhoneButton() {
        setPhoneVisible(true);
        GoogleAnalyticsService.sendEvent({ category: 'Company', action: 'Click show phone button' });
        GoogleAnalyticsService.setPageView('/recherche/voir_numero_direct');
        GoogleAnalyticsService.setPageView('/recherche/voir_numero');
        GoogleAnalyticsService.setPageView('/recherche/voir_numero_ou_email');
    }
    function showPhoneLink() {
        GoogleAnalyticsService.sendEvent({ category: 'Company', action: 'Click show phone button' });
        GoogleAnalyticsService.setPageView('/recherche/voir_numero_google');
        GoogleAnalyticsService.setPageView('/recherche/voir_numero');
        GoogleAnalyticsService.setPageView('/recherche/voir_numero_ou_email');
    }
    function renderPhone() {
        return (<p><img className="icon tel" src="/static/img/icons/phone/phone-call-pink.svg" alt="Téléphone" />{ company.phone }</p>);
    }

    // EMAIL
    function renderEmailButton(disabled) {
        return (
            <>
                <button onClick={showEmailButton} className="modal-button" aria-label="Voir l'e-mail" disabled={disabled}>
                    <span className="icon icon-mail hide-mobile" aria-hidden="true"></span>
                    <span className="hide-mobile">Voir l'e-mail</span>
                    <span className="hide-tablet hide-desktop">E-mail</span>
                </button>
                { disabled ? <p>L'e-mail de cette entreprise n'est pas disponible</p> : null }
            </>
        );
    }
    function showEmailButton() {
        setEmailVisible(true);
        GoogleAnalyticsService.sendEvent({ category: 'Company', action: 'Click show email button' });
        GoogleAnalyticsService.setPageView('/recherche/voir_email');
        GoogleAnalyticsService.setPageView('/recherche/voir_numero_ou_email');
    }
    function renderEmail() {
        return (<p><img className="icon mail" src="/static/img/icons/mail/mail-pink.svg" alt="Email" />{ company.email }</p>);
    }


    return (
        <div className="company-phone-email">
            <ul className="list-unstyled inline-list">
                <li>
                    { !phoneVisible ? (phoneExists ? renderPhoneButton() : renderPhoneLink()) : renderPhone() }
                </li>
                <li className={ !emailExists ? 'no-email' : '' }>
                    { !emailVisible ? renderEmailButton(!emailExists) : renderEmail() }
                </li>
            </ul>
        </div>
    )
}