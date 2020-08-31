
import React, { Component } from 'react';
import { Experiment, Variant } from '@marvelapp/react-ab-test';

import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import store from '../../../services/store';
import { constants } from '../../../constants';

export class CompanyListItem extends Component {

    selectCompany = () => {
        CompanyDetailsService.setCompany(this.props.company);
    }

    hasBeenVisited = (siret) => {
        return store.getState().visitedSirets.has(siret);
    }

    blurItem = (event) => {
        this.props.hoverFn();
    }

    hoverItem = (event) => {
        let target = event.target;
        // If we hover a child element, we have to get the <li> parent
        while (target.nodeName.toLowerCase() !== 'li') target = target.parentNode;

        let siret = target.attributes['data-siret'].value;
        if (siret) this.props.hoverFn(siret);
    }

    computeCssClasses = () => {
        let cssClasses = "company-list-item";
        if(this.hasBeenVisited(this.props.company.siret)) cssClasses += " visited";
        return cssClasses;
    }

    shouldComponentUpdate(nextProps) {
        return this.props.company.siret !== nextProps.company.siret;
    }


    // RENDER
    render() {
        const offers_count = this.props.company.offers.length;

        let label_class = "label hidden-market";
        let label_text = "Entreprise à contacter";
        if (offers_count >= 2) {
            label_class = "label visible-market";
            label_text = "Offres d'emploi en alternance (" + offers_count + ")";
        } else if (offers_count === 1) {
            label_class = "label visible-market";
            label_text = "Offre d'emploi en alternance";
        }

        return (
            <li data-siret={this.props.company.siret} className={this.computeCssClasses()} onClick={this.selectCompany} onMouseLeave={this.blurItem} onMouseEnter={this.hoverItem}>
                <div>
                    <Experiment name={constants.OFFERS_ABTEST_EXPERIMENT_NAME}>
                        <Variant name="visibles">
                            <div className={label_class}>{label_text}</div>
                        </Variant>
                        <Variant name="invisibles">
                        </Variant>
                    </Experiment>
                    <div className="distance"><span className="icon pink-arrow">&nbsp;</span>{this.props.company.distance} km du lieu de recherche</div>
                    <div className="title">
                        <span className="title gtm-result-sidebar-link-companylabel" aria-level="3">{this.props.company.label}</span>
                        <FavoriteButton company={this.props.company} />
                    </div>
                    <div>{ this.props.company.nafText ? <p>{this.props.company.nafText}</p>:'' }</div>
                    <button className="see-more gtm-result-sidebar-button-seemore">En savoir plus</button>
                </div>
            </li>
        );
    }
}
