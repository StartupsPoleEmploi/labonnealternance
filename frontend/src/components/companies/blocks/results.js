import React, { Component } from 'react';

import { MapBoxService } from '../../../services/mapbox.service';
import { CompaniesService } from '../../../services/companies/companies.service';
import { FiltersService } from '../../../services/filters/filters.service';
import { ViewsService } from '../../../services/view/views.service';

import { CompanyListItem } from './company_list_item';
import { CompanyFilters } from './company_filters';
import { ViewChooser } from './view-chooser';

import { COMPANIES_STORE } from '../../../services/companies/companies.store';
import { FAVORITES_STORE } from '../../../services/favorites/favorites.store';
import { FILTERS_STORE } from '../../../services/filters/filters.store';

import { VIEWS } from '../../../services/view/views.reducers';
import { VIEWS_STORE } from '../../../services/view/views.store';

export class Results extends Component {

    constructor(props) {
        super(props);

        this.mapBoxService = new MapBoxService(
            'map-results',
            'pk.eyJ1IjoibGFib25uZWJvaXRlIiwiYSI6ImNpaDNoN3A0cDAwcmdybGx5aXF1Z21lOGIifQ.znyUeU7KoIY9Ns_AQPquAg',
            this
        );

        this.companiesService = new CompaniesService();
        this.filtersService = new FiltersService();
        this.viewsService = new ViewsService();

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
            let filterActive = this.filtersService.isFiltersActive();

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
            companies = new Map(Array.from(companies.entries()).sort((a,b) => a[1].distance - b[1].distance));

            // Register companies and display no-result if needed
            this.setState({ companies, count: this.state.count + companies.size  });

            // Wait before remove loading
            setTimeout(() => {
                this.setState({ loading: false, isFiltering: false });
            }, 1000);

            // Hide or show the no-result modal
            if (companies.size === 0 && filterActive) this.setState({ modalNoResult: true });
            else this.setState({ modalNoResult: false });

            // Call parent to show or hide the search form or filters
            this.props.handleCompanyCount(companies.size);
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
    }

    componentDidMount() {
        // Create map when the component is ready
        this.mapBoxService.createMap(this.props.longitude, this.props.latitude);

        // For each jobs, get companies
        let distance = this.mapBoxService.getMapMinDistance();
        this.props.jobs.map(job => this.companiesService.getCompanies(job, this.props.longitude, this.props.latitude, { distance }));
    }

    componentWillUnmount() {
        // Unsubscribe
        this.companiesStore();
        this.favoritesStore();
        this.filterStore();
    }

    // FILTERS
    applyFilters = (filters) => {
        // Clear datas
        this.mapBoxService.removeAllMakers();
        this.setState(
            { companies: new Map(), count: 0, isFiltering: true },
            () => this.companiesService.applyFilters(filters)
        );

    }

    // SEARCH
    getNewCompanies(newLongitude, newLatitude, newDistance) {
        // Clear datas
        this.mapBoxService.removeAllMakers();
        this.setState({ companies: new Map(), count: 0, loading: true });
        this.companiesService.clearCompanies();

        // For each jobs, get companies
        let distance = this.mapBoxService.getMapMinDistance();
        this.props.jobs.map(job => this.companiesService.getCompanies(job, newLongitude, newLatitude, { distance }));
    }

    // COMPANY LIST
    // Call when the user hover/blur a company in the right list
    listItemHover = (siret) => {
        // TODO : no change if the selected siret is the one already selected
        if (siret === undefined) { this.mapBoxService.removePinkMarker(); return; }
        this.mapBoxService.setPinkMarker(siret);
    }


    // RENDER PART
    resultsClasses = () => {
        let view = VIEWS_STORE.getState() || VIEWS.MAP;
        if(view === VIEWS.FILTERS) view = VIEWS.LIST;

        let classes = [view];
        if (this.state.loading) classes.push('loading');
        return classes.join(' ');
    }
    renderResultTitle() {
        if (this.state.companies.size === 0) return null;
        return (<div><h2>{this.companiesService.computeResultTitle(this.state.companies.size, this.props.searchTerm, this.props.cityName)}</h2></div>);
    }
    renderResultList() {
        if (this.state.companies.size === 0) return null;

        return (
            <ul className="list-unstyled list">
                {/* Entry : [siret, Company object] */}
                {Array.from(this.state.companies.entries()).map(entry => <CompanyListItem key={entry[0]} company={entry[1]} hoverFn={this.listItemHover} />)}
            </ul>
        );
    }
    renderResultsAsList() {
        // Show the company list
        return (
            <div id="list-results" className={this.state.loading ? 'loading':''} >

                {this.renderResultTitle()}

                {/* When removing CompanyFilters from DOM, it removes the current filters, so we have a show property*/}
                <CompanyFilters isFiltering={this.state.isFiltering} />

                { this.state.currentView !== VIEWS.FILTERS && this.state.currentView !== VIEWS.FORM ? this.renderResultList(): null }
            </div>
        );
    }
    render() {
        return (
            <div id="map-container">
                <div id="results" className={this.resultsClasses()}>

                    <div id="map-results">
                        { this.state.modalNoResult && !this.state.loading ?
                            <div className="no-result">
                                <div>Désolé, nous n'avons pas trouvé d'entreprises correspondant à votre recherche</div>
                                <div><strong>Faites une nouvelle recherche</strong></div>
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