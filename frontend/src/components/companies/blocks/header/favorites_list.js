import React, { Component } from 'react';
import { FavoritesService } from '../../../../services/favorites/favorites.service';
import { FAVORITES_STORE } from '../../../../services/favorites/favorites.store';
import { isEmail } from '../../../../services/helpers';
import { NotificationService } from '../../../../services/notification/notification.service';

const PLACEHOLDER_TEXT = "Votre adresse e-mail";

export class FavoritesList extends Component {
    constructor(props) {
        super(props);

        this.favoritesService = new FavoritesService();
        this.notificationService = new NotificationService();

        this.state = {
            favorites: [],
            placeholder: PLACEHOLDER_TEXT,
            email: this.favoritesService.getEmailFromLocalStorage(),
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
        this.notificationService.deleteNotification();

        if(!this.state.email || !isEmail(this.state.email)) {
            this.notificationService.createError("Votre e-mail n'est pas valide");
            return;
        }

        let promise = this.favoritesService.sendFavorites(this.state.email, this.state.favorites.map(favorite => favorite.siret));
        promise
            .then(() => this.notificationService.createSuccess("Vos favoris ont été envoyé"))
            .catch(() => this.notificationService.createError("Erreur lors de l'envoi de vos favoris. Veuillez réessayer ultérieurement."))
    }


    // Remove/Add placeholder
    removePlaceholder = () => { this.setState({ placeholder: '' }); }
    setPlaceholder = () => { this.setState({ placeholder: PLACEHOLDER_TEXT }); }

    // RENDER
    removeTitle(favorite) {
        return "Supprimer " + favorite.label + " de vos favoris";
    }
    renderFavorite(favorite) {
        return (
            <div key={favorite.siret} className="favorite-item">
                <button data-siret={favorite.siret} className="icon close-icon" title={this.removeTitle(favorite)} onClick={this.removeFavorite}>&nbsp;</button>

                <h3>{favorite.label}</h3>
                <div className="naf">{favorite.nafText}</div>

                <div className="address">
                    <h4>Adresse</h4>
                    <ul className="list-unstyled">
                        <li>{favorite.address.street}</li>
                        <li>{favorite.address.city}</li>
                    </ul>
                </div>
                <div className="contact">
                    <h4>Contact</h4>
                    <ul className="list-unstyled">
                        <li><span className="icon phone">&nbsp;</span>{favorite.phone ? favorite.phone:'Non renseigné'}</li>
                        <li><span className="icon email">&nbsp;</span>{favorite.email ? favorite.email:'Non renseigné'}</li>
                    </ul>
                </div>
            </div>
        );
    }
    render() {
        if(this.state.favorites.length === 0) {
            return(<div id="favorites-list"><h2 className="empty">Vous n'avez aucune entreprise en favori :-(</h2></div>);
        }

        return (
            <div id="favorites-list">
                <h2>Votre sélection d'entreprises</h2>

                <div className="favorites">
                    {this.state.favorites.map(favorite => this.renderFavorite(favorite))}
                </div>

                <div className="export-favorites">
                    <form method="POST" action="#" onSubmit={this.exportFavorite}>
                        <label htmlFor="export-mail" className="block sr-only">Exportez vos favoris à l'adresse suivante :</label>
                        <input id="export-mail" type="email" name="email" value={this.state.email} onChange={this.inputEmail} placeholder={this.state.placeholder} />

                        <button type="submit" className="button" title="Envoyez vos favoris">Récupérez ma liste de favoris</button>
                    </form>
                </div>

            </div>
        );
    }
}
