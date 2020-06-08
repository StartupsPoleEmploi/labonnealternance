import React, { Component } from 'react';
import toArray from 'lodash/toArray';

import { FiltersService } from '../../../services/filters/filters.service';
import { ViewsService } from '../../../services/view/views.service';

import store from '../../../services/store';

import { VIEWS } from '../../../services/view/views.reducers';
import { Loader } from '../../shared/loader/loader';
import { getNafSessionLabel } from '../../../services/companies/naf_section';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';

const HEADCOUNT_VALUES = [
    ['0', '1 ou 2', '3 à 5', '6 à 9', '10 à 19'],
    ['20 à 49'],
    ['50 à 99', '100 à 199'],
    ['200 à 249', '250 à 499'],
    ['500 à 999', '1 000 à 1 999', '2 000 à 4 999', '5 000 à 9 999', '10 000']
];

export class CompanyFilters extends Component {

    constructor(props) {
        super(props);

        // Transform jobs array to a Map
        let romesValues = new Map();
        this.props.jobs.forEach(job => romesValues.set(job.rome, job.label));

        // TODO : use store to get filters values
        this.state = {
            showFilters: false,

            headcountsSelected: [],

            nafValues: new Map(),
            nafsSelected: [],

            romeValues: romesValues,
            romesSelected: []
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showFilters || nextState.showFilters) return true;
        if (this.state.showFilters !== nextState.showFilters) return true;
        return false;
    }

    componentWillMount() {
        // FILTERS : Extract NAF text when we get companies
        this.storeSubscription = store.subscribe(() => {

            // Check if we need filter view on mobile
            if (store.getState().currentView === VIEWS.FILTERS) this.setState({ showFilters: true });
            else this.setState({ showFilters: false });

            // Check for companies update
            let companies = store.getState().companies;

            // No companies : clear filters
            if (companies.size === 0) {
                this.setState({
                    nafValues: new Map(),
                    nafsSelected: []
                });
                return;
            }

            // Companies : populate filters
            let newNafValues = new Map();

            companies.forEach((company, siret) => {
                if (company.nafSection) {
                    let nafSectionValue = getNafSessionLabel(company.nafSection);
                    if (!newNafValues.has(nafSectionValue)) newNafValues.set(company.nafSection, nafSectionValue);
                }
            });

            // Update filters selected
            this.setState({
                nafValues: newNafValues,
                nafsSelected: this.updateNafsSelected(newNafValues),

                romesSelected: this.updateRomesSelected(),
            });
        });
    }

    componentWillUnmount() {
        this.storeSubscription();
    }

    isSelected(filtersCollections, index) {
        if (filtersCollections.length === 0) return false;

        let exists = filtersCollections.find(value => value === index);
        return exists !== undefined;
    }

    showFilters = () => {
        GoogleAnalyticsService.sendEvent({ category: 'Views', action: 'Select filters view' });
        ViewsService.setFiltersView();
    }
    hideFilters = () => {
        // For mobile => show map on close
        ViewsService.setMapView();
    }

    // Select/Deselect
    unselectedAllNaf = (event) => { this.setState({ nafsSelected: [] }, () => this.filterCompanies()); }
    unselectedAllHeadcount = (event) => { this.setState({ headcountsSelected: [] }, () => this.filterCompanies()); }
    unselectedAllRome = (event) => { this.setState({ romesSelected: [] }, () => this.filterCompanies()); }


    // HEADCOUNT
    toggleHeadcount = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let value = +target.attributes['data-value'].value;

        let headcounts = this.state.headcountsSelected;

        // Add or remove value
        let index = headcounts.indexOf(value);
        if (index !== -1) headcounts = headcounts.filter(filterValue => filterValue !== value);
        else headcounts.push(value);

        this.setState({ headcountsSelected: headcounts }, () => this.filterCompanies());

    }

    // NAF
    updateNafsSelected(newNafValues) {
        // Detect if all NAF are selected
        let noNafsSelected = this.state.nafsSelected.length === 0;

        let newNafsSelected = [];

        // All the NAF were selected, so we need to select all the new NAFs
        if (!noNafsSelected) {
            // Some NAF were selected, we remove only the one not present in newNafAvailable
            this.state.nafsSelected.forEach(index => {
                // Check presence in newNafAvaible and store is new index if necessary
                if (newNafValues.has(index)) newNafsSelected.push(index);
            });
        }

        return newNafsSelected;
    }

    toggleNafFilter = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let value = target.attributes['data-value'].value;

        let nafs = this.state.nafsSelected;

        // Add or remove value
        let index = nafs.indexOf(value);
        if (index !== -1) nafs = nafs.filter(filterValue => filterValue !== value);
        else nafs.push(value);

        this.setState({ nafsSelected: nafs }, () => this.filterCompanies());
    }

    // ROME
    updateRomesSelected() {
        // Detect if all romes are selected
        let noRomesSelected = this.state.romesSelected.length === 0;

        let newRomesSelected = [];

        // All the romes were selected, so we need to select all the romes
        if (!noRomesSelected) {
            // Some rome code were selected, we remove only the one not present in newromesSelected
            this.state.romesSelected.forEach(index => {
                // Check presence in newNafAvaible and store is new index if necessary
                if (this.state.romeValues.has(index)) newRomesSelected.push(index);
            });
        }

        return newRomesSelected;
    }
    toggleRomeFilter = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let value = target.attributes['data-value'].value;

        let romes = this.state.romesSelected;

        // Add or remove value
        let index = romes.indexOf(value);
        if (index !== -1) romes = romes.filter(filterValue => filterValue !== value);
        else romes.push(value);

        this.setState({ romesSelected: romes }, () => this.filterCompanies());
    }

    // APPLY FILTERS
    filterCompanies = () => {
        let filters = { headcount: 'all', naf: 'all', rome: 'all' };

        // Headcount
        let headcountFilters = [];
        if (this.state.headcountsSelected.length < HEADCOUNT_VALUES.length && this.state.headcountsSelected.length !== 0) {
            this.state.headcountsSelected.forEach(index => { headcountFilters = headcountFilters.concat(HEADCOUNT_VALUES[index]); });
            filters.headcount = headcountFilters;
        }

        // NAF
        if (this.state.nafsSelected.length < this.state.nafValues.size && this.state.nafsSelected.length !== 0) {
            filters.naf = this.state.nafsSelected;
        }

        // ROME
        if (this.state.romesSelected.length < this.state.romeValues.size && this.state.romesSelected.length !== 0) {
            filters.rome = this.state.romesSelected;
        }

        FiltersService.saveFilters(filters);
    }


    distanceSelected = (event) => {
        let distance = +event.target.value;
        this.props.mapBoxService.setFitBounds(distance);
    }


    // RENDER
    renderRome(text, rome) {
        let selected = this.isSelected(this.state.romesSelected, rome);

        return (
            <li className={selected ? 'selected' : ''} key={rome}>
                <button data-value={rome} onClick={this.toggleRomeFilter}>
                    <span><span>{text}</span></span>
                    <span className="sr-only">{selected ? 'Activez ce filtre' : 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active' : 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    renderNaf(text, index) {
        let selected = this.isSelected(this.state.nafsSelected, index);

        return (
            <li className={selected ? 'selected' : ''} key={index}>
                <button data-value={index} onClick={this.toggleNafFilter}>
                    <span><span>{text}</span></span>
                    <span className="sr-only">{selected ? 'Activez ce filtre' : 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active' : 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    renderHeadcount(text, index) {
        let selected = this.isSelected(this.state.headcountsSelected, index);

        return (
            <li className={selected ? 'selected' : ''}>
                <button data-value={index} onClick={this.toggleHeadcount}>
                    <span>{text}</span>
                    <span className="sr-only">{selected ? 'Activez ce filtre' : 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active' : 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    render() {
        return (
            <div id="filters">
                <div className="button-container-header">
                    <button className="button small-white" onClick={this.state.showFilters ? this.hideFilters : this.showFilters}>
                        <span className="icon filter-icon">&nbsp;</span>Filtres
                    </button>
                    {this.props.isFiltering ? <Loader cssClass="loader" /> : null}
                    {this.state.showFilters ? <button className="close-container" onClick={this.hideFilters} title="Fermer les filtres"><span className="icon close-icon">&nbsp;</span></button> : null}
                </div>

                <div className={this.state.showFilters ? 'results no-padding' : 'results sr-only no-padding'}>

                    <div className="filter-title">
                        <h3>Rayon de recherche</h3>
                    </div>
                    <ul className="distance-chooser list-unstyled inline-list">
                        <li>
                            <input onChange={this.distanceSelected} id="value-10" type="radio" name="distance" value="10" />
                            <label htmlFor="value-10">10 km</label>
                        </li>
                        <li>
                            <input onChange={this.distanceSelected} id="value-30" type="radio" name="distance" value="30" />
                            <label htmlFor="value-30">30 km</label></li>
                        <li>
                            <input onChange={this.distanceSelected} id="value-60" type="radio" name="distance" value="60" />
                            <label htmlFor="value-60">60 km</label></li>
                        <li>
                            <input onChange={this.distanceSelected} id="value-100" type="radio" name="distance" value="100" />
                            <label htmlFor="value-100">100 km</label></li>
                    </ul>


                    <div className="filter-title">
                        <h3>Taille de l'entreprise</h3>
                        {this.state.headcountsSelected.length > 0 ? <button title="Désélectionner toutes les tailles d'entreprise" onClick={this.unselectedAllHeadcount}>Tout déselectionner</button> : null}
                    </div>
                    <ul className="list-unstyled">
                        {this.renderHeadcount('- de 10 salariés', 0)}
                        {this.renderHeadcount('de 10 à 50 salariés', 1)}
                        {this.renderHeadcount('de 50 à 200 salariés', 2)}
                        {this.renderHeadcount('de 200 à 500 salariés', 3)}
                        {this.renderHeadcount('+ de 500 salariés', 4)}
                    </ul>

                    <div className="filter-title">
                        <h3>Métiers</h3>
                        {this.state.romesSelected.length > 0 ? <button title="Désélectionner tous les métiers" onClick={this.unselectedAllRome}>Tout déselectionner</button> : null}
                    </div>
                    <ul className="list-unstyled">
                        {toArray(this.state.romeValues).map(rome => this.renderRome(rome[1], rome[0]))}
                    </ul>

                    <div className="filter-title">
                        <h3>Secteurs d'activité</h3>
                        {this.state.nafsSelected.length > 0 ? <button title="Désélectionner tous les secteurs d'activités" onClick={this.unselectedAllNaf}>Tout déselectionner</button> : null}
                    </div>
                    <ul className="list-unstyled">
                        {toArray(this.state.nafValues).map(naf => this.renderNaf(naf[1], naf[0]))}
                    </ul>

                    <div className="button-container">
                        <button className="button" onClick={this.filterCompanies}>Affichez les entreprises</button>
                    </div>
                </div>
            </div>

        );
    }
}