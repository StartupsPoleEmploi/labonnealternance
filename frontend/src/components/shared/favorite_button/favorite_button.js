import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../services/store';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import ReactGA from 'react-ga';


class FavoriteButton extends Component {

    addFavorite = (event) => {
        event.stopPropagation();
        ReactGA.event({ category: 'Favorites', action: 'Add favorite' });
        FavoritesService.addFavorite(this.props.company);
    }

    removeFavorite = (event) => {
        event.stopPropagation();
        FavoritesService.removeFavorite(this.props.company.siret);
    }

    isFavorite() {
        return store.getState().favorites.has(this.props.company.siret);
    }

    // RENDER
    render() {
        if (this.isFavorite()) {
            const title = 'Retirer ' + this.props.company.label + ' des favoris';

            return (<button className="favorite-button heartbeat-animation" onClick={this.removeFavorite} aria-label={title} title={title}>
                <span className="icon heart heart-active">&nbsp;</span>
            </button>);
        }

        const title = 'Ajouter ' + this.props.company.label + ' aux favoris';
        return (
            <button className="favorite-button" onClick={this.addFavorite} aria-label={title} title={title}>
                <span className="icon heart empty-heart">&nbsp;</span>
            </button>
        );
    }
}

export default connect(store => ({ favorites: store.favorites }))(FavoriteButton);