import React from 'react';
import { Loader } from '../loader/loader';


/**
 * Contain commun templates between the company_modal.js & company_details.js
 */
export class CompanyDetailsCommon {

    static renderTitle(company) {
        return (
            <div className="title">
                <h1>{company.label} a recruté des alternants en 2018.</h1>
                <strong>Tentez votre chance, postulez avant que l'offre ne soit publiée !</strong>
            </div>

        )
    }
}

export const CompanyCoordinates =  (props) => {
    const {company} = props;
    const address = company.address;

    if (!address) return <div className="loader"><Loader /></div>;

    return (
        <div className="company-coordinates">
            <div className="contact">
                <h4>Contact</h4>
                <ul className="list-unstyled">
                    <li>
                        <span className="icon phone">&nbsp;</span>
                        {company.phone ? company.phone : <a href={company.getGoogleUrl()} target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">Trouver le numéro</a>}
                    </li>
                    <li className="no-break-word">
                        <span className="icon email">&nbsp;</span>
                        {company.email ? company.email : 'Non renseigné'}
                    </li>
                </ul>
            </div>
            <div className="address">
                <h4>Adresse</h4>
                <ul className="list-unstyled">
                    <li>{address.street}</li>
                    <li>{address.city}</li>
                </ul>
            </div>
        </div>
    );
}

export const CompanyIntroduction = (props) => {
    const {company} = props;

    if (!company.address) return <div className="loader"><Loader /></div>;

    return (
        <div className="company">
            <div className="line column">
                <h3>{company.label}</h3>
                <div>{company.nafText ? <p>{company.nafText}</p> : ''}</div>
            </div>

            <div className="line">
                {company.officeName ? <div className="office-name"><h4>Raison sociale</h4><div>{company.officeName}</div></div> : null}
                <div className="headcount">
                    <h4>Taille</h4>
                    {company.headcount ? <p>{company.headcount}</p> : 'Non renseigné'}
                </div>

                <div className="hire-rate"><h4>Site Internet</h4>
                    {company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">{company.website}</a> : 'Non renseigné'}
                </div>
            </div>
        </div>
    );
}

export const PrepareApplication = (props) => {
    const {company, rome} = props;
    const softSkills = company.softSkills;

    if (!softSkills && rome) return <div className="loader"><Loader /></div>;

    return (
        <div className="prepare-application">
            <div className="line responsive-column">
                {softSkills && rome ? <div className="soft-skills">
                    <h4>Connaissez-vous les qualités qu'il faut pour ce métier ?</h4>
                    <ul className="list-unstyled two-columns">
                        {softSkills.map((skill, index) => <li key={index}>- {skill}</li>)}
                    </ul>
                </div> : null}
                <div className="application-advices">
                    <h4>C'est quoi une candidature spontanée ?</h4>
                    <div>
                        <p>FIXME static text</p>
                    </div>
                    <h4>Passez à l'action</h4>
                    <div>
                        <p>FIXME dynamic text</p>
                    </div>
                    <div>
                        <h5>1. Header</h5>
                        <ul className="list-unstyled">
                            <li>- List item</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}