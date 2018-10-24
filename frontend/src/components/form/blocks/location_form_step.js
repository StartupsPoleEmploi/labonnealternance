import React, { Component } from 'react';
import debounce from 'lodash/debounce';

import store from '../../../services/store';
import { AutocompleteLocationService } from '../../../services/autocomplete_location/autocomplete_location.service';
import { CurrentLocationService } from '../../../services/current_location/current_location.service';

import { Location } from '../../../services/search_form/location';
import { NotificationService } from '../../../services/notification/notification.service';

import { Loader } from '../../shared/loader/loader';
import { GoogleAnalyticsService } from '../../../services/google_analytics.service';

const PLACEHOLDER_TEXT = 'Ecrivez le nom de votre ville';

export class LocationFormStep extends Component {

    constructor(props) {
        super(props);

        this.callAutocompleteCityFn = debounce(this.callAutocompleteCity, 250)

        // Get search form register values
        let term = ''; let autocompleteLocation; let currentLocation;
        if (this.props.searchForm && this.props.searchForm.location) {
            let location = this.props.searchForm.location;
            if (location.isGeolocated) {
                currentLocation = {
                    address: location.label,
                    zipcode: location.zipcode,
                    longitude: location.longitude,
                    latitude: location.latitude
                };
            } else {
                term = location.label;
                autocompleteLocation = {
                    address: location.label,
                    slug: location.slug,
                    zipcode: location.zipcode,
                    longitude: location.longitude,
                    latitude: location.latitude
                };
            }
        }

        this.state = {
            currentLocation,
            loading: false,

            autocompleteLocation,
            suggestions: [],
            term,
            placeholder: PLACEHOLDER_TEXT
        };
    }

    componentWillMount() {
        NotificationService.deleteNotification();

        this.autocompleteLocationStore = store.subscribe(() => {
            this.setState({ suggestions: store.getState().locationSuggestions });
        });

        // When we get the user position and address
        this.currentLocationStore = store.subscribe(() => {
            let locationSaved = store.getState().currentLocation;

            if (!locationSaved) return;

            // Save location
            this.props.searchForm.setLocation(
                new Location(locationSaved.address, locationSaved.zipcode, '', locationSaved.longitude, locationSaved.latitude, true)
            );
            if (this.props.onChange) this.props.onChange(); // Notifify parent

            this.setState({
                autocompleteLocation: undefined,
                term: '',
                suggestions: [],
                loading: false,
                currentLocation: {
                    address: locationSaved.address,
                    zipcode: locationSaved.zipcode,
                    longitude: locationSaved.longitude,
                    latitude: locationSaved.latitude
                }
            });
        });
    }

    componentWillUnmount() {
        // Unsubscribe
        this.currentLocationStore();
        this.autocompleteLocationStore();
    }


    // Remove/Add placeholder
    removePlaceholder = () => { this.setState({ placeholder: '' }); }
    setPlaceholder = () => { this.setState({ placeholder: PLACEHOLDER_TEXT }); }

    // Trigger when the user is typing a city's name
    autocompleteCity = (event) => {
        let term = event.target.value;
        this.setState({ term });
        if (term && term.length > 2) this.callAutocompleteCityFn();
    }
    callAutocompleteCity = () => {
        let term = this.state.term;
        if (term && term.length > 2) {
            AutocompleteLocationService.getCities(term);
        }
    }

    // Trigger when an user click on a city suggestion
    saveCityAutocomplete = (event) => {
        let zipcode = event.target.attributes['data-zipcode'].value;
        let longitude = event.target.attributes['data-longitude'].value;
        let latitude = event.target.attributes['data-latitude'].value;
        let citySlug = event.target.attributes['data-slug'].value;
        let city = event.target.innerText;

        // Save location
        this.saveLocation(city, zipcode, citySlug, longitude, latitude);
    }
    // Save a location (not geolocated)
    saveLocation(city, zipcode, citySlug, longitude, latitude, validateCallback = false) {
        this.props.searchForm.setLocation(
            new Location(city, zipcode, citySlug, longitude, latitude, false)
        );
        if (this.props.onChange) this.props.onChange(); // Notifify parent

        this.setState({
            currentLocation: undefined,
            suggestions: [],
            term: city,
            autocompleteLocation: { address: city, slug: citySlug, zipcode, longitude, latitude }
        }, () => { if (validateCallback) this.validateStep(); });

    }

    // Trigger when cliking on my current position
    getCurrentLocation = () => {
        this.setState({ loading: true });

        GoogleAnalyticsService.sendEvent({ category: 'Search', action: 'Use geolocalisation' });

        navigator.geolocation.getCurrentPosition((position) => {
            CurrentLocationService.getCurrentLocation(position.coords.longitude, position.coords.latitude);
        });
    }

    isGeolocated = () => {
        if (this.state.autocompleteLocation !== undefined) return false;
        return true;
    }

    getLocation = () => {
        let location;
        if (this.state.autocompleteLocation) location = this.state.autocompleteLocation;
        else if (this.state.currentLocation) location = this.state.currentLocation;

        return location;
    }

    isValid = () => {
        let location = this.props.searchForm.location;
        if (!location) return false;

        let zipcode = location.zipcode || undefined;
        let longitude = location.longitude || undefined;
        let latitude = location.latitude || undefined;

        return zipcode && longitude && latitude;
    }

    nextIfEnter = (event) => {
        if (event.key === 'Enter') {
            // We take the first element in auto-complete (if possible)
            if (this.state.suggestions.length > 0) {
                let firstSuggestion = this.state.suggestions[0];

                // Save (and validateSetp by using true at the end of the function call)
                let city = firstSuggestion.city + ' (' + firstSuggestion.zipcode + ')';
                let citySlug = firstSuggestion.city + '-' + firstSuggestion.zipcode;
                this.saveLocation(city, firstSuggestion.zipcode, citySlug, firstSuggestion.longitude, firstSuggestion.latitude, true);
            }
        }
    }

    validateStep = () => {
        if (!this.props.searchForm.location) {
            NotificationService.createError('Aucune coordonnée renseignée !');
            return;
        }
        if (!this.props.searchForm.location.isValid()) {
            NotificationService.createError('Erreur avec les coordonnées renseignées !');
            return;
        }

        // Call next step of the form
        this.props.next();
    }


    distanceSelected = (event) => {
        let distance = +event.target.value;
        this.props.searchForm.setDistance(distance);
        this.forceUpdate();
    }

    // RENDER PART
    renderDistanceSelected(value) {
        return this.props.searchForm.getDistance() === value ? 'checked' : '';
    }
    renderLocationButton() {
        let location = this.state.currentLocation;

        if (navigator.geolocation) {
            return (
                <div className="location-container hide-desktop">
                    <button className="button white" onClick={this.getCurrentLocation}>
                        {this.state.loading ? <div className="loader"><Loader className="loader" /></div> : <span className="icon marker-cyan">&nbsp;</span>}
                        {location && location.address ? location.address : 'Ma position actuelle'}
                    </button>
                </div>
            );
        }
        // Geolocation not available
        return (
            <div className="location-container hide-desktop">
                <button className="button white" disabled="disabled">
                    Ma position actuelle
                </button>
                <p>La géolocalisation n'est pas disponible sur votre appareil</p>
            </div>
        );
    }
    renderSuggestions() {
        if (this.state.suggestions.length === 0) return;

        return (
            <ul className="suggestions list-unstyled">
                {
                    this.state.suggestions.map((city, index) => (
                        <li key={city.city + '-' + city.zipcode}>
                            <button class={city.zipcode} onClick={this.saveCityAutocomplete} data-zipcode={city.zipcode} data-latitude={city.latitude} data-slug={city.city + '-' + city.zipcode} data-longitude={city.longitude}>
                                {city.city} ({city.zipcode})
                            </button>
                        </li>)
                    )
                }
            </ul>
        );
    }
    renderSubmitBlock() {
        let showSubmit = true;
        if (this.props.showSubmit !== undefined) showSubmit = this.props.showSubmit;
        if (!showSubmit) return null;

        return (
            <div className="submit-container">
                <button className="button go-button" disabled={!this.isValid()} onClick={this.validateStep}>C'est parti !</button>
            </div>
        );
    }
    render() {
        if (!this.props.show) return null;

        return (
            <div id="location-form-step">
                <h2><label htmlFor="location-input">Où voulez-vous chercher votre future entreprise ?</label></h2>

                {this.renderLocationButton()}

                <div className="or hide-desktop">ou</div>

                <input id="location-input" type="text" onBlur={this.setPlaceholder} onKeyPress={this.nextIfEnter} onFocus={this.removePlaceholder} placeholder={this.state.placeholder}
                    value={this.state.term} onChange={this.autocompleteCity} />

                {this.renderSuggestions()}
                <div className="distance">dans un rayon de</div>
                <ul className="distance-chooser unstyled-list list-inline">
                    <li>
                        <input checked={this.renderDistanceSelected(10)} onChange={this.distanceSelected} id="value-10" type="radio" name="distance" value="10" />
                        <label htmlFor="value-10">10 km</label>
                    </li>
                    <li>
                        <input checked={this.renderDistanceSelected(30)} onChange={this.distanceSelected} id="value-30" type="radio" name="distance" value="30" />
                        <label htmlFor="value-30">30 km</label></li>
                    <li>
                        <input checked={this.renderDistanceSelected(60)} onChange={this.distanceSelected} id="value-60" type="radio" name="distance" value="60" />
                        <label htmlFor="value-60">60 km</label></li>
                    <li>
                        <input checked={this.renderDistanceSelected(100)} onChange={this.distanceSelected} id="value-100" type="radio" name="distance" value="100" />
                        <label htmlFor="value-100">100 km</label></li>
                </ul>

                {this.renderSubmitBlock()}
            </div>
        );
    }
}