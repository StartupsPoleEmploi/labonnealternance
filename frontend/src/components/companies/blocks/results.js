import React, { Component } from 'react';
import toArray from 'lodash/toArray';
import ReactGA from 'react-ga';

import { MapBoxService } from '../../../services/mapbox.service';
import { CompaniesService } from '../../../services/companies/companies.service';
import { FiltersService } from '../../../services/filters/filters.service';
import { RequestOccuringService } from '../../../services/requests_occuring/request_occuring.service';

import { CompanyListItem } from './company_list_item';
import { CompanyFilters } from './company_filters';
import { ViewChooser } from './view-chooser';

import { COMPANIES_STORE } from '../../../services/companies/companies.store';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import { FILTERS_STORE } from '../../../services/filters/filters.store';

import { VIEWS } from '../../../services/view/views.reducers';
import { VIEWS_STORE } from '../../../services/view/views.store';
import { REQUEST_OCCURING_STORE } from '../../../services/requests_occuring/request_occuring.store';

export class Results extends Component {

    constructor(props) {
        super(props);

        this.mapBoxService = new MapBoxService(
            'map-results',
            'pk.eyJ1IjoibGFib25uZWJvaXRlIiwiYSI6ImNpaDNoN3A0cDAwcmdybGx5aXF1Z21lOGIifQ.znyUeU7KoIY9Ns_AQPquAg',
            this
        );

        this.state = {
            loading: true,
            companies: new Map(),
            count: 0,

            showFilters: false,
            isFiltering: false,

            modalNoResult: false,

            // Mobile
            currentView: VIEWS.MAP,
        };
    }

    componentWillMount() {
        // Listen to the company store
        this.companiesStore = COMPANIES_STORE.subscribe(() => {
            // Detect if a filter is active
            let filterActive = FiltersService.isFiltersActive();

            let companiesStored = COMPANIES_STORE.getState();
            let companies = this.state.companies;

            companiesStored.forEach((company, siret) => {
                // Not display if filtered ?
                if (company.visible === false) return;
                if (companies.has(company.siret)) return;

                companies.set(siret, company);

                // Wait between 0..1 second to add a marker (to create a little delay)
                let delay = Math.random();
                setTimeout(() => {
                    // Note : no setState({}) here => to avoid a lot of component update
                    this.mapBoxService.addMarker(company);
                }, delay * 1000); // x1000 to get in second instead of milliseconds
            });

            // Sort companies by distance
            companies = new Map(toArray(companies.entries()).sort((a,b) => a[1].distance - b[1].distance));

            // Register companies and display no-result if needed
            this.setState({ companies, count: this.state.count + companies.size  });

            // Wait before remove loading
            setTimeout(() => {
                this.setState({ loading: false, isFiltering: false })
            }, 1000);


            // If we don't expect other request result
            if(REQUEST_OCCURING_STORE.getState() === 0) {
                // Hide or show the no-result modal
                if (companies.size === 0 && !filterActive) this.setState({ modalNoResult: true });
                else this.setState({ modalNoResult: false });

                // Call parent to show or hide the search form or filters
                this.props.handleCompanyCount(companies.size);
            }
        });

        // When a favorite is added/deleted => force update of the list
        this.favoritesStore = FAVORITES_STORE.subscribe(() => {
            this.forceUpdate();
        });

        // When filters are saved, automatically filter results
        this.filterStore = FILTERS_STORE.subscribe(() => {
            this.applyFilters(FILTERS_STORE.getState());
        });

        // When view change
        VIEWS_STORE.subscribe(() => {
            let view = VIEWS_STORE.getState() || VIEWS.MAP;
            this.setState({ currentView: view });
        })
    }

    componentDidMount() {
        // Create map when the component is ready
        this.mapBoxService.createMap(this.props.longitude, this.props.latitude, this.props.distance);

        // For each jobs, get companies
        let distance = this.mapBoxService.getMapMinDistance();
        CompaniesService.getCompanies(this.props.jobs, this.props.longitude, this.props.latitude, { distance });
    }

    componentWillUnmount() {
        // Unsubscribe
        this.companiesStore();
        this.favoritesStore();
        this.filterStore();
    }

    closeNoResultModal = () => {
        this.setState({ modalNoResult: false });
    }

    // FILTERS
    applyFilters = (filters) => {
        // Clear datas
        this.mapBoxService.removeAllMakers();
        this.setState(
            { companies: new Map(), count: 0, isFiltering: true },
            () => CompaniesService.applyFilters(filters)
        );

    }

    // SEARCH
    getNewCompanies(newLongitude, newLatitude) {
        // Add the first request here (will be decrement in this.companiesService.getCompanies)
        // Why here ? Because when we clear companies, the behavior on 'no result event' is displayed all along the application
        RequestOccuringService.addRequest();

        // Clear datas
        this.mapBoxService.removeAllMakers();
        this.setState({ companies: new Map(), count: 0, loading: true });
        CompaniesService.clearCompanies();

        // For each jobs, get companies
        let distance = this.mapBoxService.getMapMinDistance();

        CompaniesService.getCompanies(this.props.jobs, newLongitude, newLatitude, { distance });
    }
    updateFitBounds(distance) {
        this.mapBoxService.setFitBounds(distance);
    }

    // COMPANY LIST
    // Call when the user hover/blur a company in the right list
    listItemHover = (siret) => {
        // TODO : no change if the selected siret is the one already selected
        if (siret === undefined) { this.mapBoxService.removePinkMarker(); return; }
        this.mapBoxService.setPinkMarker(siret);
    }

    move = (event) => {
        let direction = event.target.attributes['data-direction'].value;
        event.preventDefault();
        ReactGA.event({ category: 'Map', action: 'Use map arrow' });
        this.mapBoxService.move(direction);
    }

    // RENDER PART
    resultsClasses = () => {
        let view = this.state.currentView;

        let classes = [view];
        if (this.state.loading) classes.push('loading');
        return classes.join(' ');
    }
    renderResultTitle() {
        if (this.state.companies.size === 0) return null;
        return (<div><h1>{CompaniesService.computeResultTitle(this.state.companies.size, this.props.searchTerm, this.props.cityName)}</h1></div>);
    }
    renderResultList() {
        if (this.state.companies.size === 0) return null;

        return (
            <ul className="list-unstyled list">
                {/* Entry : [siret, Company object] */}
                {toArray(this.state.companies.entries()).map(entry => <CompanyListItem key={entry[0]} company={entry[1]} hoverFn={this.listItemHover} />)}
            </ul>
        );
    }
    renderResultsAsList() {
        // Show the company list
        return (
            <div id="list-results" className={this.state.loading ? 'loading':''} >

                { this.state.currentView !== VIEWS.FILTERS  ? this.renderResultTitle() : null }

                {/* When removing CompanyFilters from DOM, it removes the current filters, so we have a show property*/}
                {/* FIXME: we add the service instead of the method... because _this_ will refer to the childComponent if we pass the method... */}
                <CompanyFilters jobs={this.props.jobs} isFiltering={this.state.isFiltering} mapBoxService={this.mapBoxService}/>
                { this.state.currentView !== VIEWS.FILTERS ? this.renderResultList(): null }
            </div>
        );
    }
    render() {
        return (
            <div id="map-container">
                <div id="results" className={this.resultsClasses()}>

                    <div id="map-results">
                        <div className="map-direction-controls">
                            <button onClick={this.move} data-direction="top" className="top">&nbsp;</button>
                            <button onClick={this.move} data-direction="bottom" className="bottom">&nbsp;</button>
                            <button onClick={this.move} data-direction="left" className="left">&nbsp;</button>
                            <button onClick={this.move} data-direction="right" className="right">&nbsp;</button>
                        </div>
                        { this.state.modalNoResult && !this.state.loading ?
                            <div className="no-result">
                                <div>Désolé, nous n'avons pas trouvé d'entreprises correspondant à votre recherche</div>
                                <div><strong>Elargissez votre recherche grâce à la carte ou faites une nouvelle recherche.</strong></div>

                                <button className="close" onClick={this.closeNoResultModal}><span className="icon close-icon">&nbsp;</span></button>
                            </div> : null
                        }
                    </div>
                    {this.renderResultsAsList()}

                    <ViewChooser />
                </div>
            </div>
        );
    }
}