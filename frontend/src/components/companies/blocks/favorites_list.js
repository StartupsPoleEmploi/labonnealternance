import React, { Component } from 'react';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';

export class FavoritesList extends Component {
    constructor(props) {
        super(props);

        this.favoritesService = new FavoritesService();

        this.state = {
            favorites: []
        };
    }

    componentDidMount() {
        // First values
        this.updateFavorites();
        this.favoriteStore = FAVORITES_STORE.subscribe(() => this.updateFavorites());
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.favoriteStore();
    }

    updateFavorites() {
        let favoritesStored = FAVORITES_STORE.getState();
        let favorites = [];

        favoritesStored.forEach((favorite, siret) => {
            favorites.push(favorite);
        });

        this.setState({ favorites });
    }

    // Trigger when user click on remove button
    removeFavorite = (event) => {
        let siret = event.target.attributes['data-siret'].value;
        if (siret) this.favoritesService.removeFavorite(siret);
    }

    // RENDER
    renderFavorite(favorite) {
        return (<li>
            <span>
                {favorite.label}
                <button data-siret={favorite.siret} className="remove" onClick={this.removeFavorite}>x</button>
            </span>
        </li>);
    }
    render() {
        let plural = this.state.favorites.length > 1;
        return (
            <div>
                <h4>Vous avez actuellement {this.state.favorites.length} favori{plural ? 's':''} stocké{plural ? 's':''} sur votre appareil</h4>
                <ul>
                    {this.state.favorites.map(favorite => this.renderFavorite(favorite))}
                </ul>
            </div>
        );
    }
}