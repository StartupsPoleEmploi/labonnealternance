import { Favorite } from './favorite';

export const FAVORITES_ACTIONS = {
    ADD_FAVORITE: 'ADD_FAVORITE',
    REMOVE_FAVORITE: 'REMOVE_FAVORITE',
    REMOVE_ALL_FAVORITE: 'REMOVE_ALL_FAVORITE',
    ADD_ALL_FAVORITES: 'ADD_ALL_FAVORITES',
};

export const FAVORITES_REDUCERS = (state = new Map(), action) => {

    switch (action.type) {
        case FAVORITES_ACTIONS.ADD_FAVORITE: {
            let favorites = new Map(state);

            favorites.set(action.data.company.siret,
                new Favorite(
                    action.data.company.siret,
                    action.data.company.label,
                    action.data.company.longitude,
                    action.data.company.latitude,
                    action.data.company.city,
                    action.data.company.nafText,
                    action.data.company.address,
                    action.data.company.email,
                    action.data.company.phone,
                    action.data.company.website
                )
            );

            return favorites;
        }

        case FAVORITES_ACTIONS.REMOVE_FAVORITE: {
            let favorites = new Map(state);
            favorites.delete(action.data.siret);
            return favorites;
        }

        case FAVORITES_ACTIONS.REMOVE_ALL_FAVORITE:
            return new Map();

        case FAVORITES_ACTIONS.ADD_ALL_FAVORITES: {
            let favorites = new Map();
            action.data.favorites.forEach(favorite => {
                favorites.set(favorite.siret, favorite);
            });
            return favorites;
        }

        default:
            return state;
    }
};