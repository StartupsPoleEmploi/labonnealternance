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
            let company = action.data.company;

            favorites.set(company.siret,
                new Favorite(
                    company.siret,
                    company.label,
                    company.longitude,
                    company.latitude,
                    company.nafText,
                    // Address
                    {
                        street: ''.concat(company.address.street_number,' ', company.address.street_name),
                        city: ''.concat(company.address.zipcode, ' ', company.address.city)
                    },
                    company.email,
                    company.phone,
                    company.website
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
            console.log(action.data.favorites)
            action.data.favorites.forEach(favorite => {
                favorites.set(favorite.siret, favorite);
            });
            console.log('favorites', favorites)
            return favorites;
        }

        default:
            return state;
    }
};