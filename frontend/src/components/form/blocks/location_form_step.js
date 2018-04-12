import React, { Component } from 'react';
import debounce from 'lodash/debounce';


import { AutocompleteLocationService } from '../../../services/autocomplete_location/autocomplete_location.service';
import { AUTOCOMPLETE_LOCATION_STORE } from '../../../services/autocomplete_location/autocomplete_location.store';
import { CurrentLocationService } from '../../../services/current_location/current_location.service';
import { CURRENT_LOCATION_STORE } from '../../../services/current_location/current_location.store';

import { Location } from '../../../services/search_form/location';
import { NotificationService } from '../../../services/notification/notification.service';
import { SearchFormService } from '../../../services/search_form/search_form.service';

import { Loader } from '../../shared/loader/loader';

const PLACEHOLDER_TEXT = 'Ecrivez le nom de votre ville';

export class LocationFormStep extends Component {

    constructor(props) {
        super(props);

        this.autocompleteLocationService = new AutocompleteLocationService();
        this.currentLocationService = new CurrentLocationService();
        this.notificationService = new NotificationService();
        this.searchFormService = new SearchFormService();

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
        this.notificationService.deleteNotification();

        this.autocompleteLocationStore = AUTOCOMPLETE_LOCATION_STORE.subscribe(() => {
            this.setState({ suggestions: AUTOCOMPLETE_LOCATION_STORE.getState() });
        });

        // When we get the user position and address
        this.currentLocationStore = CURRENT_LOCATION_STORE.subscribe(() => {
            let locationSaved = CURRENT_LOCATION_STORE.getState() || undefined;

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
        console.log("callAutocompleteCity");
        this.autocompleteLocationService.getCities(this.state.term);
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
        }, () => { if (validateCallback) this.validateStep(); } );


    }

    // Trigger when cliking on my current position
    getCurrentLocation = () => {
        this.setState({ loading: true });
        navigator.geolocation.getCurrentPosition((position) => {
            this.currentLocationService.getCurrentLocation(position.coords.longitude, position.coords.latitude);
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
            this.notificationService.createError('Aucune coordonnée renseignée !');
            return;
        }
        if (!this.props.searchForm.location.isValid()) {
            this.notificationService.createError('Erreur avec les coordonnées renseignées !');
            return;
        }

        // Call next step of the form
        this.props.next();
    }


    // RENDER PART
    renderLocationButton() {
        let location = this.state.currentLocation;

        if (navigator.geolocation) {
            return (
                <div className="location-container">
                    <button className="button white" onClick={this.getCurrentLocation}>
                        { this.state.loading ? <div className="loader"><Loader className="loader" /></div> : <span className="icon marker-cyan">&nbsp;</span> }
                        { location && location.address ? location.address : 'Ma position actuelle' }
                    </button>
                </div>
            );
        }
        // Geolocation not available
        return (
            <div className="location-container">
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
                        <li key={city.city + '-' + city.zipcode} onClick={this.saveCityAutocomplete} data-zipcode={city.zipcode} data-latitude={city.latitude} data-slug={city.city+'-'+city.zipcode} data-longitude={city.longitude}>
                            {city.city} ({city.zipcode})
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

                { this.renderLocationButton()}

                <div className="or">ou</div>

                <input id="location-input" type="text" onBlur={this.setPlaceholder} onKeyPress={this.nextIfEnter} onFocus={this.removePlaceholder} placeholder={this.state.placeholder}
                    value={this.state.term} onChange={this.autocompleteCity} />

                { this.renderSuggestions()}

                {this.renderSubmitBlock()}
            </div>
        );
    }
}