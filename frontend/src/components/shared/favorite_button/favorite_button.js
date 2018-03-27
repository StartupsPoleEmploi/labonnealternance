import React, { Component } from 'react';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import { FavoritesService } from '../../../services/favorites/favorites.service';

export default class FavoriteButton extends Component {

    constructor(props) {
        super(props);
        this.favoritesService = new FavoritesService();
    }

    addFavorite = (event) => {
        event.stopPropagation();
        this.favoritesService.addFavorite(this.props.company);
    }

    removeFavorite = (event) => {
        event.stopPropagation();
        this.favoritesService.removeFavorite(this.props.company.siret);
    }

    isFavorite() {
        return FAVORITES_STORE.getState().has(this.props.company.siret);
    }

    // RENDER
    render() {
        if (this.isFavorite()) {
            return (<button className="favorite-button heartbeat-animation" onClick={this.removeFavorite} title={'Retirer ' + this.props.company.label + ' des favoris'}>
                <span className="icon heart heart-active">&nbsp;</span>
            </button>);
        }

        return (
            <button className="favorite-button" onClick={this.addFavorite} title={'Ajouter ' + this.props.company.label + ' aux favoris'}>
                <span className="icon heart empty-heart">&nbsp;</span>
            </button>
        );
    }
}