import { FAVORITES_ACTIONS } from './favorites.reducers';
import { FAVORITES_STORE } from './favorites.store';
import { Favorite } from './favorite';

const LOCAL_STORAGE_KEY = 'FAVORITES';

export class FavoritesService {

    constructor() {
        // Save favorites to local storage when favorites change
        FAVORITES_STORE.subscribe(() => {
            this.saveFavoritesToLocalStorage();
        });
    }

    addFavorite(company) {
        FAVORITES_STORE.dispatch({
            type: FAVORITES_ACTIONS.ADD_FAVORITE,
            data: { company }
        });
    }

    removeFavorite(siret) {
        FAVORITES_STORE.dispatch({
            type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
            data: { siret }
        });
    }

    getFavoritesFromLocalStorage() {
        let favorites = [];

        let rawValues = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!rawValues) return undefined;

        // Recreate favorites
        try {
            let values = JSON.parse(rawValues);
            values.forEach(data => {
                favorites.push(
                    new Favorite(
                        data.siret,
                        data.label,
                        data.longitude,
                        data.latitude,
                        data.city,
                        data.nafText,
                        data.address,
                        data.email,
                        data.phone,
                        data.website
                    )
                );

            });
        } catch (e) {
            console.error(e);
        }

        // Save favorites
        FAVORITES_STORE.dispatch({
            type: FAVORITES_ACTIONS.ADD_ALL_FAVORITES,
            data: { favorites }
        });

        return favorites;
    }

    saveFavoritesToLocalStorage() {
        // Transform the favorite map to an array
        let favorites = [];
        FAVORITES_STORE.getState().forEach((favorite, siret) => favorites.push(favorite));

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    }
}