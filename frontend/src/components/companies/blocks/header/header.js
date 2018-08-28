import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';

import { FavoritesList } from './favorites_list';
import SearchForm from '../../../shared/search_form/search_form';
import { FAVORITES_STORE } from '../../../../services/favorites/favorites.store';

export class Header extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            favoritesNumber: 0,

            // Avoid auto-close of search form
            showFormClicked: false,

            showSearchForm: false,
            showFavorites: false,
            animateMagnifier: false,
        })
    }


    componentWillReceiveProps(nextProps, nextContent) {
        // No changes ? Do nothing !
        if(this.animateMagnifier === nextProps.animateMagnifier && this.showForm === nextProps.showForm) return;

        if(nextProps.animateMagnifier === true && this.state.animateMagnifier === false) {
            this.setState({ animateMagnifier: true });
        } else if(nextProps.animateMagnifier === false && this.state.animateMagnifier === true) {
            this.setState({ animateMagnifier: false });
        }

        // Show/hide new form
        if(nextProps.showForm === true && this.state.showSearchForm === false) {
            this.setState({ showSearchForm: true });
        } else if (nextProps.showForm === false && this.state.showSearchForm === true && this.state.showFormClicked === false) {
            this.setState({ showSearchForm: false });
        }
    }

    componentWillMount() {
        // When a favorite is added/remove
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            let favorites = FAVORITES_STORE.getState() || [];
            this.setState({ favoritesNumber: favorites.size });
        });
    }

    componentDidMount() {
        // On mount, we init the number of favorites
        let favorites = FAVORITES_STORE.getState() || [];
        this.setState({ favoritesNumber: favorites.size });
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.favoritesStore();
    }

    // CLOSE/OPEN
    closeSearchForm = (event) => { this.setState({ showSearchForm: false, showFavorites: false, animateMagnifier: false, showFormClicked: false }); }
    openSearchForm  = (event) => {
        ReactGA.event({ category: 'Search', action: 'Open search form' });
        this.setState({ showSearchForm: true, showFavorites: false, animateMagnifier: false, showFormClicked: true });
    }
    closeFavorites  = (event) => { this.setState({ showSearchForm: false, showFavorites: false, showFormClicked: false }); }
    openFavorites   = (event) => {
        ReactGA.event({ category: 'Favorites', action: 'Open favorites list' });
        this.setState({ showSearchForm: false, showFavorites: true, showFormClicked: false });
    }


    // CLASSES
    computeFavoriteClasses() {
        let classes = 'icon large-favorite';

        if (this.state.favoritesNumber) classes = classes.concat(' heart-active');
        else classes = classes.concat(' empty-heart');

        return classes;
    }
    computeMagnifierClasses() {
        let classes = 'magnifier';

        if (this.state.showSearchForm) classes = classes.concat(' active');
        if (this.state.animateMagnifier) classes = classes.concat(' animate');

        return classes;
    }
    computeTitleContainerClasses() {
        let classes = 'title-container';
        if (this.state.showSearchForm || this.state.showFavorites) classes = classes.concat(' open');
        return classes;
    }

    // RENDER
    renderNewSearchButton() {
        return(
            <button className={this.computeMagnifierClasses()} onClick={this.state.showSearchForm ? this.closeSearchForm:this.openSearchForm} title={this.state.showFavorites ? 'Fermer le bloc de recherche':'Afficher le bloc de recherche'}>
                <span className="sub">Recherche</span>
            </button>
        );
    }
    renderFavoriteButton() {
        return(
            <button className={this.computeFavoriteClasses()} onClick={this.state.showFavorites ? this.closeFavorites:this.openFavorites} title={this.state.showSearchForm ? 'Fermer la liste des favoris':'Afficher la liste des favoris'}>
                <span className={this.state.favoritesNumber === 0 ? 'empty':'not-empty'}>{this.state.favoritesNumber}</span>
                <span className="sub">Mes favoris</span>
            </button>
        );
    }
    render() {
        let showOffset = this.props.showOffset === false ? false : true;
        let showButtons = this.props.showButtons === false ? false : true;

        return (
            <header id="global-header">
                {showOffset ? <div className="offset">&nbsp;</div> : null}
                <div className={this.computeTitleContainerClasses()}>
                    <div className="title">
                        <Link className="logo" to="/"><img src="/static/img/logo/logo-noir-lba.svg" alt="Retour à l'accueil" title="Retour à l'accueil" /></Link>
                        { showButtons ? this.renderFavoriteButton()  : null }
                        { showButtons ? this.renderNewSearchButton() : null }
                    </div>
                    {this.state.showSearchForm ? <div className="search-form"><SearchForm /></div>: null}
                    {this.state.showFavorites ? <div className="favorites"><FavoritesList /></div> : null}

                </div>
            </header>
        );
    }
}