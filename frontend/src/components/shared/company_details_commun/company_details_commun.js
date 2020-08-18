import React, { Component } from 'react';
import { Experiment, Variant } from '@marvelapp/react-ab-test';
import { Loader } from '../loader/loader';
import { slug } from '../../../services/helpers';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';
import { CompanyType } from '../../../services/companies/company';
import { constants } from '../../../constants';

/**
 * Contain commun templates between the company_modal.js & company_details.js
 */
export class CompanyDetailsCommon {

    static renderTitle(company) {
        const type = company.getType();
        return type === CompanyType.DPAE ? <div className="company-promotion text-center">
                <p>
                    <strong>
                        <span>{company.label}</span> a des salariés qui exercent le métier auquel vous vous destinez. <br />
                        Faites-lui découvrir les avantages d’un recrutement en alternance dans votre candidature !
                    </strong>
                </p>
            </div>
            : <div className="company-promotion text-center">
                <p>
                    <strong>
                        <span>{company.label}</span> a recruté en alternance dans le passé.<br />
                        Tentez votre chance, envoyez votre candidature !
                    </strong>
                </p>
            </div>;
    }
}

export const CompanyCoordinates =  (props) => {
    const {company} = props;

    return (
        <div className="company-coordinates">
            <div className="contact">
                <h4>Contact</h4>
                <ul className="list-unstyled">
                    <li><span className="icon phone">&nbsp;</span>{company.phone ? company.phone : 'Non renseigné'}</li>
                    <li className="no-break-word"><span className="icon email">&nbsp;</span>{company.email ? company.email : 'Non renseigné'}</li>
                </ul>
            </div>
        </div>
    );
}

export const CompanyIntroduction = ({ company }) => {
    const address = company.address;

    function trackOfferLink() {
        GoogleAnalyticsService.setPageViewWithOfferInfo('/recherche/clic_offre');
    }

    return (
        <div className="company text-center">
            <div className="line column grey padding">
                <h1>{company.label}</h1>
                <div>{company.nafText ? <p>{company.nafText}</p> : ''}</div>
            </div>

            <div className="line two-columns">
                <div className="office-name grey padding">
                    <img src="/static/img/icons/icon-home.svg" alt="" className="icon" />
                    <h2>Enseigne</h2>
                    <div>{ company.officeName ? company.officeName : <span aria-label="Inconnu">-</span> }</div>
                </div>

                <div className="headcount grey padding">
                    <img src="/static/img/icons/icon-people.svg" alt="" className="icon" />
                    <h2>Taille</h2>
                    {company.headcount ? <p>{company.headcount}</p> : <span aria-label="Inconnu">-</span>}
                </div>
            </div>

            <div className="line two-columns">
                <div className="website grey padding">
                    <img src="/static/img/icons/icon-screen.svg" alt="" className="icon" />
                    <h2>Site Internet</h2>
                    { company.website ?
                        <a href={company.website} target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">
                            {company.website}
                        </a> : <span aria-label="Inconnu">-</span>}
                </div>

                <div className="address grey padding">
                    <img src="/static/img/icons/icon-place.svg" alt="" className="icon" />
                    <h2>Adresse</h2>
                    { address ?
                        <ul className="list-unstyled">
                            <li>{address.street}</li>
                            <li>{address.city}</li>
                        </ul> : <span aria-label="Inconnu">-</span>
                    }
                </div>

            </div>

            { company.getType() === CompanyType.OFFER &&
                <Experiment name={constants.OFFERS_ABTEST_EXPERIMENT_NAME}>
                    <Variant name="visibles">
                        <div className="line offers column grey padding">
                            <h2>Voici { company.offers.length >= 2 ? "les offres" : "l'offre" } en lien avec cette entreprise</h2>
                            <ul className="list-unstyled">
                                { company.offers.map(function(listValue){
                                    return (
                                        <li key={ listValue.id }>
                                            <a href={ listValue.url } target="_blank" onClick={trackOfferLink} rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">
                                                { listValue.name } - offre n° { listValue.id }
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Variant>
                    <Variant name="invisibles">
                    </Variant>
                </Experiment>
            }

            <div className="line text-center grey">
                <div className="siret">
                    <p>N° de siret {company.siret}</p>
                </div>
            </div>
        </div>
    );
}

export const PrepareApplication = ({ company, rome }) => {
    const softSkills = company.softSkills;

    return (
        <div className="prepare-application">
            <div>
                {softSkills && rome ? <div className="soft-skills">
                    <h2 className="text-center">Connaissez-vous les qualités requises pour ce métier ?</h2>
                    <ul className="list-unstyled inline-list text-center">
                        {softSkills.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div> : <div className="loader"><Loader /></div>}


                <ToggleBlock title="C'est quoi une candidature spontanée ?"  iconPath="/static/img/icons/glasses.svg" >
                    <div>
                    L’entreprise n’a pas déposé d’offre d’emploi, vous pouvez tout de même lui envoyer votre Cv pour lui indiquer que vous seriez très intéressé pour intégrer son équipe dans le cadre de votre alternance.
                    Consultez  <a href="https://www.youtube.com/watch?v=1kSosmRpr04" title="Vidéo Youtube de présentation des candidatues spontanées (Ouverture dans une nouvelle fenêtre)" target="_blank" rel="noopener noreferrer">cette courte vidéo</a> pour tout savoir sur la candidature spontanée.
                    </div>
                </ToggleBlock>

                <ToggleBlock title="Comment se préparer pour une candidature spontanée ?" iconPath="/static/img/icons/list.svg" >
                    <ul className="list-unstyled">
                        <li>- Adaptez votre lettre de motivation aux informations recueillies sur l'entreprise : Activité, actualités et valeurs. Pour obtenir ces informations, rendez vous sur le site de l'entreprise</li>
                        <li>- Mettez en valeur vos qualités en lien avec le métier recherché et indiquez pourquoi vous souhaitez réaliser votre alternance dans cette entreprise en particulier</li>
                        <li>- Besoin d'aide pour concevoir votre CV ? Il existe plusieurs outils gratuits :
                            <ul>
                                <li><a href="https://cv.clicnjob.fr/">CLICNJOB</a></li> 
                                <li><a href="https://cvdesignr.com/fr">CVDesignR</a></li>
                                <li><a href="https://www.canva.com/fr_fr/creer/cv/">Canva</a></li>
                            </ul>
                        </li>
                    </ul>
                </ToggleBlock>

                <ToggleBlock title="Quels sont les avantages pour l'employeur ?" iconPath="/static/img/icons/like.svg" >
                    <ul class="list-unstyled">
                        <li>- Une embauche à coût très réduit grâce aux aides existantes</li>
                        <li>- Un moyen de former à ses métiers et d'anticiper un besoin de main d'oeuvre</li>
                        <li>- La valorisation des compétences de ses salariés, en leur confiant un apprenti et en reconnaissant leur capacité de transmettre un métier</li>
                    </ul>
                </ToggleBlock>

            </div>
        </div>
    );
}



class ToggleBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: slug(this.props.title)
        }
    }

    setOpen = () => {
        const newValue = !this.state.open;
        this.setState({ open: newValue });
    }

    render() {
        const { iconPath, title } = this.props;
        const { open, id } = this.state;

        return (
            <div className={ open ? "toggle-block open" : "toggle-block" }>
                <h2>
                    <button className="btn reset" onClick={this.setOpen} aria-controls={ '#' + id } aria-expanded={open}>
                        <img src={ iconPath } alt="" className="intro" />
                        <span>{ title }</span>
                        <img src="/static/img/icons/cross.svg" alt="" className="icon" />
                    </button>
                </h2>
                <div id={id} className={ open ? 'toggle-content open' : 'toggle-content' }>{this.props.children}</div>
            </div>
        )
    }
}
