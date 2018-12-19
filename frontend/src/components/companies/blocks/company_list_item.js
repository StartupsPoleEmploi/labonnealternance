
import React, { Component } from 'react';

import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import FavoriteButton from '../../shared/favorite_button/favorite_button';
import { VISITED_SIRETS_STORE } from '../../../services/visited_sirets/visited_sirets.store';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';

export class CompanyListItem extends Component {

    componentWillMount() {
        // When a favorite is added/deleted
        this.favoritesStore = FAVORITES_STORE.subscribe(() => this.forceUpdate());
    }

    selectCompany = () => {
        CompanyDetailsService.setCompany(this.props.company);
    }

    hasBeenVisited = (siret) => {
        return VISITED_SIRETS_STORE.getState().has(siret);
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

    componentWillUnmount() {
        this.favoritesStore();
    }

    // RENDER
    render() {
        return (
            <li data-siret={this.props.company.siret} className={this.computeCssClasses()} onClick={this.selectCompany} onMouseLeave={this.blurItem} onMouseEnter={this.hoverItem}>
                <div>
                    <div className="distance"><span className="icon pink-arrow">&nbsp;</span>{this.props.company.distance} km du lieu de recherche</div>
                    <div className="title">
                        <span className="title" aria-level="3">{this.props.company.label}</span>
                        <FavoriteButton company={this.props.company} />
                    </div>
                    <div>{ this.props.company.nafText ? <p>{this.props.company.nafText}</p>:'' }</div>
                    <button className="see-more">En savoir plus</button>
                </div>
            </li>
        );
    }
}
