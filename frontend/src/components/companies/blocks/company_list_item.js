
import React, { Component } from 'react';

import { CompanyDetailsService } from '../../../services/company_details/company_details.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import FavoriteButton from '../../shared/favorite_button/favorite_button';

export class CompanyListItem extends Component {

    constructor(props) {
        super(props);
        this.companyDetailsService = new CompanyDetailsService();
        this.favoritesService = new FavoritesService();
    }

    selectCompany = () => {
        this.companyDetailsService.setCompany(this.props.company);
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

    // RENDER
    render() {
        return (
            <li data-siret={this.props.company.siret} className="company-list-item" onMouseLeave={this.blurItem} onMouseEnter={this.hoverItem}>
                <div>
                    <div><span className="icon pink-arrow">&nbsp;</span>{this.props.company.distance} km(s) du lieu de recherche</div>
                    <div className="title">
                        <span className="title" aria-level="3">{this.props.company.label}</span>
                        <FavoriteButton company={this.props.company} />
                    </div>

                    <div>{ this.props.company.nafText ? <p>{this.props.company.nafText}</p>:'' }</div>
                </div>
            </li>
        );
    }
}