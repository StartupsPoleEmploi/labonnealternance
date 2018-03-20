import React, { Component } from 'react';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';

export class FavoritesList extends Component {
    constructor(props) {
        super(props);

        this.favoritesService = new FavoritesService();

        this.state = {
            favorites: [],
            email: this.favoritesService.getEmailFromLocalStorage()
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

    inputEmail = (event) => { this.setState({ email: event.target.value }); }
    exportFavorite = (event) => {
        event.preventDefault();
    
        // TODO => check e-mail
        if(this.state.email) this.favoritesService.sendFavorites(this.state.email);
    }

    // RENDER
    renderFavorite(favorite) {
        return (<li key={favorite.siret}>
            <span className="block">{favorite.label}</span>
            <span className="block"><span className="icon phone">&nbsp;</span>{ favorite.phone ? favorite.phone:'Non renseigné' }</span>
            <span className="block"><span className="icon email">&nbsp;</span>{ favorite.email ? favorite.email:'Non renseigné' }</span>
            <button data-siret={favorite.siret} className="remove" onClick={this.removeFavorite}>x</button>
        </li>);
    }
    render() {
        let plural = this.state.favorites.length > 1;
        return (
            <div id="favorites-list">
                <h4>Vous avez actuellement {this.state.favorites.length === 0 ? 'aucun':this.state.favorites.length} {plural ? 'favoris stockés':'favori stocké'} sur votre appareil</h4>
                
                <div className="export-favorites">
                    <form method="POST" action="#" onSubmit={this.exportFavorite}>
                        <label htmlFor="export-mail" className="block sr-only">Exportez ces favoris à l'adresse suivante :</label>
                        <input id="export-mail" type="email" name="email" value={this.state.email} onInput={this.inputEmail} placeholder="Exportez ces favoris à l'adresse suivante" />

                        <button type="submit" title="Envoyez vos favoris">Envoi</button>
                    </form>

                </div>
                
                <ul className="list-unstyled">
                    {this.state.favorites.map(favorite => this.renderFavorite(favorite))}
                </ul>
            </div>
        );
    }
}