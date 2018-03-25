import React, { Component } from 'react';
import { COMPANIES_STORE } from '../../../services/companies/companies.store';
import { slug } from '../../../services/helpers';
import { FiltersService } from '../../../services/filters/filters.service';

const HEADCOUNT_VALUES = [
    ['0', '1 ou 2', '3 à 5', '6 à 9', '10 à 19'],
    ['20 à 49'],
    ['50 à 99','100 à 199'],
    ['200 à 249','250 à 499'],
    ['500 à 999','1 000 à 1 999','2 000 à 4 999','5 000 à 9 999','10 000']
];

const HEADCOUNT_SELECTED_INDEX = [0,1,2,3,4];

export class CompanyFilters extends Component {

    constructor(props) {
        super(props);

        this.filtersService = new FiltersService();

        this.state = {
            showFilter: false,

            headcountsSelected: HEADCOUNT_SELECTED_INDEX,

            nafValues: new Map(),
            nafsSelected: [],

            romeValues: new Map(),
            romesSelected: []
        };
    }

    componentWillMount() {
        // FILTERS : Extract NAF text when we get companies
        this.companiesStore = COMPANIES_STORE.subscribe(() => {

            let companies = COMPANIES_STORE.getState();

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
            let newRomeValues = new Map();

            companies.forEach((company, siret) => {
                // Naf
                let nafSlug = slug(company.nafText);
                if (!newNafValues.has(nafSlug)) newNafValues.set(nafSlug, company.nafText);

                // Job
                if (!newRomeValues.has(company.job.rome)) newRomeValues.set(company.job.rome, company.job.label);
            });

            // Update NAF selected
            this.setState({
                nafValues: newNafValues,
                nafsSelected: this.updateNafsSelected(newNafValues),

                romeValues: newRomeValues,
                romesSelected: this.updateRomesSelected(newRomeValues),
            });
        });
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companiesStore();
    }

    isSelected(filtersCollections, index) {
        let exists = filtersCollections.find(value => value === index);
        return exists !== undefined;
    }

    // Select/Deselect
    unselectedAllNaf = (event) => { this.setState({ nafsSelected: [] }, () => this.filterCompanies()); }
    unselectedAllHeadcount = (event) => { this.setState({ headcountsSelected: [] }, () => this.filterCompanies());  }
    unselectedAllRome = (event) => { this.setState({ romesSelected: [] }, () => this.filterCompanies());  }

    selectAllHeadcount = (event) => { this.setState({ headcountsSelected: HEADCOUNT_SELECTED_INDEX }, () => this.filterCompanies()); }
    selectAllNaf = (event) => {
        this.setState({ nafsSelected: Array.from(this.state.nafValues.keys()) }, () => this.filterCompanies());
    }
    selectAllRome = (event) => {
        this.setState({ romesSelected: Array.from(this.state.romeValues.keys()) }, () => this.filterCompanies());
    }

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
        let allNafsSelected = this.state.nafValues.size === this.state.nafsSelected.length;

        let newNafsSelected = [];

        // All the NAF were selected, so we need to select all the new NAFs
        if (!allNafsSelected) {
            // Some NAF were selected, we remove only the one not present in newNafAvailable
            this.state.nafsSelected.forEach(index => {
                // Check presence in newNafAvaible and store is new index if necessary
                if (newNafValues.has(index)) newNafsSelected.push(index);
            });
        } else {
            newNafsSelected = Array.from(newNafValues.keys());
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
    updateRomesSelected(newRomeValues) {
        // Detect if all NAF are selected
        let allromesSelected = this.state.romeValues.size === this.state.romesSelected.length;

        let newromesSelected = [];

        // All the NAF were selected, so we need to select all the new NAFs
        if (!allromesSelected) {
            // Some rome code were selected, we remove only the one not present in newromesSelected
            this.state.romesSelected.forEach(index => {
                // Check presence in newNafAvaible and store is new index if necessary
                if (newRomeValues.has(index)) newromesSelected.push(index);
            });
        } else {
            newromesSelected = Array.from(newRomeValues.keys());
        }

        return newromesSelected;
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
        if (this.state.headcountsSelected.length < HEADCOUNT_VALUES.length) {
            this.state.headcountsSelected.forEach(index => { headcountFilters = headcountFilters.concat(HEADCOUNT_VALUES[index]); });
            filters.headcount = headcountFilters;
        }

        // NAF
        if (this.state.nafsSelected.length < this.state.nafValues.size) {
            filters.naf = this.state.nafsSelected;
        }

        // ROME
        if (this.state.romesSelected.length < this.state.romeValues.size) {
            filters.rome = this.state.romesSelected;
        }

        this.filtersService.saveFilters(filters);
    }

    // RENDER
    renderRome(text, rome) {
        let selected = this.isSelected(this.state.romesSelected, rome);

        return (
            <li className={selected ? 'selected': ''} key={rome}>
                <button data-value={rome} onClick={this.toggleRomeFilter}>
                    <span><span>{text}</span></span>
                    <span className="sr-only">{selected ? 'Activez ce filtre': 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active': 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    renderNaf(text, index) {
        let selected = this.isSelected(this.state.nafsSelected, index);

        return (
            <li className={selected ? 'selected': ''} key={slug(index)}>
                <button data-value={index} onClick={this.toggleNafFilter}>
                    <span><span>{text}</span></span>
                    <span className="sr-only">{selected ? 'Activez ce filtre': 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active': 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    renderHeadcount(text, index) {
        let selected = this.isSelected(this.state.headcountsSelected, index);

        return (
            <li className={selected ? 'selected': ''}>
                <button data-value={index} onClick={this.toggleHeadcount}>
                    <span>{text}</span>
                    <span className="sr-only">{selected ? 'Activez ce filtre': 'Désactivez ce filtre'}</span>
                    <span  className={selected ? 'icon check-active': 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    render() {
        return (
            <div id="filters" className={this.props.show ? 'no-padding':'sr-only no-padding'}>

                <div className="filter-title">
                    <h3>Taille de l'entreprise</h3>
                    { this.state.headcountsSelected.length > 0 ?
                        <button title="Désélectionner toutes les tailles d'entreprise" onClick={this.unselectedAllHeadcount}>Tout déselectionner</button>:
                        <button title="Sélectionner toutes les tailles d'entreprise" onClick={this.selectAllHeadcount}>Tout sélectionner</button>
                    }
                </div>
                <ul className="list-unstyled">
                    { this.renderHeadcount('- de 10 salariés', 0)}
                    { this.renderHeadcount('de 10 à 50 salariés', 1)}
                    { this.renderHeadcount('de 50 à 200 salariés', 2)}
                    { this.renderHeadcount('de 200 à 500 salariés', 3)}
                    { this.renderHeadcount('+ de 500 salariés', 4)}
                </ul>

                <div className="filter-title">
                    <h3>Métiers</h3>
                    { this.state.romesSelected.length > 0 ?
                        <button title="Désélectionner tous les métiers" onClick={this.unselectedAllRome}>Tout déselectionner</button>:
                        <button title="Sélectionner tous les métiers" onClick={this.selectAllRome}>Tout sélectionner</button>
                    }
                </div>
                <ul className="list-unstyled">
                    {Array.from(this.state.romeValues).map(rome => this.renderRome(rome[1], rome[0] ))}
                </ul>

                <div className="filter-title">
                    <h3>Secteurs d'activité</h3>
                    { this.state.nafsSelected.length > 0 ?
                        <button title="Désélectionner tous les secteurs d'activités" onClick={this.unselectedAllNaf}>Tout déselectionner</button>:
                        <button title="Sélectionner tous les secteurs d'activités" onClick={this.selectAllNaf}>Tout sélectionner</button>
                    }
                </div>
                <ul className="list-unstyled">
                    {Array.from(this.state.nafValues).map(naf => this.renderNaf(naf[1], naf[0] ))}
                </ul>

                <div className="button-container">
                    <button className="button" onClick={this.filterCompanies}>Affichez les entreprises</button>
                </div>
            </div>
        );
    }
}