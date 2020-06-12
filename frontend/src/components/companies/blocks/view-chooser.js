import React, { Component } from 'react';

import store from '../../../services/store';
import { VIEWS } from '../../../services/view/views.reducers';
import { ViewsService } from '../../../services/view/views.service';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';

export class ViewChooser extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            view: VIEWS.MAP
        });
    }

    componentDidMount() {
        this.viewsStore = store.subscribe(() => {
            let view = store.getState().currentView;
            this.setState({ view });
        });
    }

    componentWillUnmount() {
        // Unscribe to views store
        this.viewsStore();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.view !== this.state.view;
    }

    setFiltersView = () => {
        GoogleAnalyticsService.sendEvent({ category: 'Views', action: 'Select filters view' });
        ViewsService.setFiltersView();
    }
    setMapView = () => {
        GoogleAnalyticsService.sendEvent({ category: 'Views', action: 'Select map view' });
        ViewsService.setMapView();
    }
    setListView = () => {
        GoogleAnalyticsService.sendEvent({ category: 'Views', action: 'Select list view' });
        ViewsService.setListView();
    }


    renderListViewButtons() {
        return (
            <div className="toggle-view-container right">
                <button className="button small-white" onClick={this.setMapView}><span className="icon marker-blue">&nbsp;</span>Carte</button>
            </div>
        );
    }
    renderMapViewButtons() {
        return (
            <div className="toggle-view-container">
                <button className="button small-white" onClick={this.setFiltersView}><span className="icon filter-icon">&nbsp;</span>Filtres</button>
                <button className="button small-white" onClick={this.setListView}><span className="icon filter-list-icon">&nbsp;</span>Liste</button>
            </div>
        );
    }

    render() {
        if (this.state.view === VIEWS.MAP) return this.renderMapViewButtons();
        else if (this.state.view === VIEWS.LIST) return this.renderListViewButtons();

        // Default case
        return null;
    }
}