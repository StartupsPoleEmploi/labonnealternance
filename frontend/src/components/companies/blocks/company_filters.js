import React, { Component } from 'react';
import { COMPANIES_STORE } from '../../../services/companies/companies.store';
import { slug } from '../../../services/helpers';

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

        this.state = {
            showFilter: false,

            headcountSelectedIndex: HEADCOUNT_SELECTED_INDEX,

            nafValues: [],
            nafSelectedIndex: [],

        };
    }

    componentWillMount() {
        // FILTERS : Extract NAF text when we get companies
        this.companiesStore = COMPANIES_STORE.subscribe(() => {

            let companies = COMPANIES_STORE.getState();

            // No companies : clear filters
            if (companies.length === 0) {
                this.setState({
                    nafValues: [],
                    nafSelectedIndex: []
                });
                return;
            }

            // Companies : populate filters
            let newNafValues = [];
            companies.forEach(company => {
                let exits = newNafValues.find(nafText => company.nafText.toLowerCase() === nafText.toLowerCase());
                if (!exits) newNafValues.push(company.nafText);
            });

            // Update NAF selected
            this.setState({
                nafValues: newNafValues,
                nafSelectedIndex: this.updateNafSelected(newNafValues),
            });
        });
    }

    componentWillUnmount() {
        // Unsubscribe to listeners
        this.companiesStore();
    }

    isSelected(filtersCollections, index) {
        let exists = filtersCollections.find(value => value === index);
        return Number.isInteger(exists);
    }

    // Select/Deselect
    deselectedAllNaf = (event) => { this.setState({ nafSelectedIndex: [] }, () => this.filterCompanies()); }
    deselectedAllHeadcount = (event) => { this.setState({ headcountSelectedIndex: [] }, () => this.filterCompanies());  }

    selectAllHeadcount = (event) => { this.setState({ headcountSelectedIndex: HEADCOUNT_SELECTED_INDEX }, () => this.filterCompanies()); }
    selectAllNaf = (event) => {
        let nafSelectedIndex = [];
        for (let i = 0; i < this.state.nafValues.length; i++) nafSelectedIndex.push(i);
        this.setState({ nafSelectedIndex }, () => this.filterCompanies());
    }

    // HEADCOUNT
    toggleHeadcount = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let value = +target.attributes['data-value'].value;

        let headcounts = this.state.headcountSelectedIndex;

        // Add or remove value
        let index = headcounts.indexOf(value);
        if (index !== -1) headcounts = headcounts.filter(filterValue => filterValue !== value);
        else headcounts.push(value);

        this.setState({ headcountSelectedIndex: headcounts }, () => this.filterCompanies());

    }

    // NAF
    updateNafSelected(newNafValues) {
        // Detect if all NAF are selected
        let allNafSelected = this.state.nafValues.length === this.state.nafSelectedIndex.length;

        let newNafSelectedIndex = [];

        // All the NAF were selected, so we need to select all the new NAFs
        if (!allNafSelected) {
            // Some NAF were selected, we remove only the one not present in newNafAvailable
            this.state.nafSelectedIndex.forEach(indexSelected => {
                let nafSelected = this.state.nafValues[indexSelected];

                // Check presence in newNafAvaible and store is new index if necessary
                let indexInNewNaf = newNafValues.indexOf(nafSelected);
                if (indexInNewNaf !== -1) newNafSelectedIndex.push(indexInNewNaf);
            });
        }

        // If no NAF selected, we select all the NAF
        if (newNafSelectedIndex.length === 0) {
            for (let i = 0; i < newNafValues.length; i++) newNafSelectedIndex.push(i);
        }

        return newNafSelectedIndex;
    }
    toggleNafFilter = (event) => {
        // If we hover a child element, we have to get the <button> parent
        let target = event.target;
        while (target.nodeName.toLowerCase() !== 'button') target = target.parentNode;

        let value = +target.attributes['data-value'].value;

        let nafs = this.state.nafSelectedIndex;

        // Add or remove value
        let index = nafs.indexOf(value);
        if (index !== -1) nafs = nafs.filter(filterValue => filterValue !== value);
        else nafs.push(value);

        this.setState({ nafSelectedIndex: nafs }, () => this.filterCompanies());
    }

    filterCompanies = () => {
        let filters = { headcount: 'all', naf: 'all' };

        // Headcount
        let headcountFilters = [];
        if (this.state.headcountSelectedIndex.length < HEADCOUNT_VALUES.length) {
            this.state.headcountSelectedIndex.forEach(index => { headcountFilters = headcountFilters.concat(HEADCOUNT_VALUES[index]); });
            filters.headcount = headcountFilters;
        }

        // NAF
        let nafFilters = [];
        if (this.state.nafSelectedIndex.length < this.state.nafValues.length) {
            this.state.nafSelectedIndex.forEach(index => { nafFilters = nafFilters.concat(this.state.nafValues[index].toLowerCase()); });
            filters.naf = nafFilters;
        }

        this.props.onFilter(filters);
    }

    // RENDER
    renderNaf(text, index) {
        let selected = this.isSelected(this.state.nafSelectedIndex, index);
        return (
            <li className={selected ? 'selected': ''} key={slug(text)}>
                <button data-value={index} onClick={this.toggleNafFilter}>
                    <span><span>{text}</span></span>
                    <span className="sr-only">{selected ? 'Activez ce filtre': 'Désactivez ce filtre'}</span>
                    <span className={selected ? 'icon check-active': 'icon check-inactive'}>&nbsp;</span>
                </button>
            </li>
        );
    }
    renderHeadcount(text, index) {
        let selected = this.isSelected(this.state.headcountSelectedIndex, index);
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
                    { this.state.headcountSelectedIndex.length > 0 ?
                        <button title="Désélectionner toutes les tailles d'entreprise" onClick={this.deselectedAllHeadcount}>Tout déselectionner</button>:
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
                    <h3>Secteurs d'activité</h3>
                    { this.state.nafSelectedIndex.length > 0 ?
                        <button title="Désélectionner tous les secteurs d'activités" onClick={this.deselectedAllNaf}>Tout déselectionner</button>:
                        <button title="Sélectionner tous les secteurs d'activités" onClick={this.selectAllNaf}>Tout sélectionner</button>
                    }
                </div>
                <ul className="list-unstyled">
                    {this.state.nafValues.map((text, index) => this.renderNaf(text, index))}
                </ul>

                <div className="button-container">
                    <button className="button" onClick={this.filterCompanies}>Affichez les entreprises</button>
                </div>
            </div>
        );
    }
}