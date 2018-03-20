import debounce from 'lodash/debounce';

// Initiate the window.L variable
import { leaflet } from 'mapbox.js';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { formatString } from '../services/helpers';

import { CompaniesService } from './companies/companies.service';
import { CompanyDetailsService } from './company_details/company_details.service';
import { COMPANY_DETAILS_STORE } from './company_details/company_details.store';

import { FAVORITES_STORE } from './favorites/favorites.store';

// Trigger when the user click on the popup
window.selectSiret = (el) => {
    if (!el) return;
    let siret = el.getAttribute('data-siret');

    if (siret) {
        let companyDetailsService = new CompanyDetailsService();
        companyDetailsService.setCompanySiret(siret);
    }
};

const popupTemplate = `
    <div class='popup-content' data-siret='{siret}' onClick='selectSiret(this)'>
        <span><span class='icon pink-arrow'></span>{distance} km(s) du lieu de recherche</span>
        <span class='blue'>{companyName}</span>
        <span class='blue'>{address}</span>
        <span>{nafText}</span>
        <span class='pink'>Ça m'intéresse !</span>
    </div>
`;


export class MapBoxService {

    constructor(id, accessToken, parentComponent) {
        // Add mapbox CSS to the page
        this.addMapboxCssFile();
        this.initIcons();

        // Default value
        this.MAX_DISTANCE = 3000;
        this.DEFAULT_DISTANCE = 50;
        this.DISTANCE_GAP_FOR_RELOAD = 5; // Minimum distance for reload
        this.currentCenter = undefined;

        this.id = id;
        this.accessToken = accessToken;
        this.parentComponent = parentComponent;

        this.map = undefined; // No map yet

        // We use lodash.debounce() to get new companies
        // only if user don't move the map for 0.300 second
        this.newCompaniesFn = debounce(this.getNewCompanies, 300);

        this.companiesService = new CompaniesService();

        // Markers store and clusters
        this.markers = new Map();
        this.CLUSTERS_ID = 'CLUSTERS_ID';
        this.CLUSTERS_OPTS = { id: this.CLUSTERS_ID, maxClusterRadius: 30 };
        this.clusters = new MarkerClusterGroup(this.CLUSTERS_OPTS);

        // Store the visited companies
        this.siretsVisited = new Map();


        // LISTENERS
        // When a company is selected, we saved it (for gray marker)
        COMPANY_DETAILS_STORE.subscribe(() => {
            let company = COMPANY_DETAILS_STORE.getState();
            if (company && !this.siretsVisited.has(company.siret)) this.siretsVisited.set(company.siret, '');
        });
    }

    createMap(longitude, latitude) {
        window.L.mapbox.accessToken = this.accessToken;
        this.map = window.L.mapbox.map(this.id, 'mapbox.streets').setView([latitude, longitude], 11).setMinZoom(7);

        // Add the search center
        this.currentCenter = { lat: latitude, lng: longitude };
        this.currentPositionMarker = window.L.marker([ latitude , longitude ], { icon: this.cyanIcon, interactive: false });
        this.currentPositionMarker.addTo(this.map);

        this.map.on('dragend', () => this.newCompaniesFn());
        this.map.on('zoom', () => this.newCompaniesFn());
    }


    // MARKERS
    addMarker(company) {
        let icon = this.determineMarkerIcon(company.siret);
        let marker = window.L.marker([ company.latitude , company.longitude ], { company, icon });

        // Change color on click
        marker.on('click', (event) => {
            let siret = event.target.options.company.siret;
            if (siret) this.setPinkMarker(siret);
        });

        // Add popup
        let popupContent = formatString(popupTemplate, {
            companyName: company.label,
            address: company.city || '',
            nafText: company.nafText,
            distance: company.distance,
            siret: company.siret,
        });
        let popup = window.L.popup({ siret: company.siret }).setContent(popupContent);
        marker.bindPopup(popup);

        // Save the marker
        this.markers.set(company.siret, marker);

        // Add to the cluster layer
        this.clusters.addLayer(marker);
        this.map.addLayer(this.clusters);
    }

    // Favorite Icon ? Gray icon ? Default icon ?
    determineMarkerIcon(siret) {
        if (FAVORITES_STORE.getState().has(siret)) return this.favoriteIcon;
        if (this.siretsVisited.has(siret)) return this.grayIcon;
        return this.blueIcon;
    }

    removePinkMarker() {
        if (this.pinkMarker) {
            this.pinkMarker.setIcon(this.determineMarkerIcon(this.pinkMarker.options.company.siret));
            this.pinkMarker = undefined;
        }
    }
    setPinkMarker(siret) {
        this.removePinkMarker();

        // Add the new one and save
        let marker = this.markers.get(siret);
        if (marker) {
            marker.setIcon(this.pinkIcon);
            this.pinkMarker = marker;
        }
    }
    removeAllMakers() {
        this.markers.clear();

        // Clean, remove and create cluster
        this.clusters.eachLayer(layer => this.clusters.removeLayer(layer));
        this.map.removeLayer(this.CLUSTERS_ID);
        this.clusters = new MarkerClusterGroup(this.CLUSTERS_OPTS);
        this.map.addLayer(this.clusters);
    }


    getNewCompanies() {
        let center = this.map.getCenter();

        // Reload if distance between the last center is at least x km
        let distanceLastCenter = this.computeDistance(center, this.currentCenter);
        if (distanceLastCenter <= this.DISTANCE_GAP_FOR_RELOAD) return;

        // Change center position
        this.currentPositionMarker.setLatLng([center.lat, center.lng]);
        this.currentCenter = { lat: center.lat, lng: center.lng };

        /* FIXME :
        If we call the parent component, the `this` will refer to this class (and not the parent class)
        It's why we do the call for new companies here... */
        this.parentComponent.getNewCompanies(center.lng, center.lat, this.getMapMinDistance());
    }


    // DISTANCE HELPERS FOR THE MAP
    getMapMinDistance() {
        // We see the entire map : max distance
        let zoom = this.map.getZoom();
        if (zoom > 0 && zoom <= 7) return this.MAX_DISTANCE;

        // Compute the min distance between North->South and Est->West
        let bounds = this.map.getBounds();
        let latitudeDistance = this.computeDistance(bounds.getNorthWest(), bounds.getNorthEast());
        let longitudeDistance = this.computeDistance(bounds.getNorthWest(), bounds.getSouthEast());

        return Math.min(latitudeDistance, longitudeDistance);
    }

    convertRad(value) { return (Math.PI * value) / 180; }

    computeDistance(pointA, pointB){
        let R = 6378000; // Earth radius

        let latA = this.convertRad(pointA.lat);
        let lonA = this.convertRad(pointA.lng);
        let latB = this.convertRad(pointB.lat);
        let lonB = this.convertRad(pointB.lng);

        let distance = R * (Math.PI/2 - Math.asin( Math.sin(latB) * Math.sin(latA) + Math.cos(lonB - lonA) * Math.cos(latB) * Math.cos(latA)));

        // We want the distance from the center, so we divided the distance by 2
        distance = distance / 2;

        return Math.trunc(distance / 1000);
    }


    addMapboxCssFile() {
        // CSS File
        let idCss = 'mapbox-css';
        if (document.getElementById(idCss)) { return; }

        let link = document.createElement('link');
        link.text = 'text/css';
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css';

        document.head.appendChild(link);
    }

    initIcons() {
        this.blueIcon = window.L.icon({ iconUrl: '/static/img/markers/marker-blue.svg', iconSize: [20, 29], shadowSize: [20, 29], iconAnchor: [0, 0], shadowAnchor: [0, 0], popupAnchor: [10, 0] });
        this.cyanIcon = window.L.icon({ iconUrl: '/static/img/markers/marker-cyan.svg', className: 'center-icon sr-only', iconSize: [20, 29], shadowSize: [20, 29], iconAnchor: [0, 0], shadowAnchor: [0, 0], popupAnchor: [10, 0] });
        this.grayIcon = window.L.icon({ iconUrl: '/static/img/markers/marker-gray.svg', iconSize: [20, 29], shadowSize: [20, 29], iconAnchor: [0, 0], shadowAnchor: [0, 0], popupAnchor: [10, 0] });
        this.pinkIcon = window.L.icon({ iconUrl: '/static/img/markers/marker-pink.svg', iconSize: [20, 29], shadowSize: [20, 29], iconAnchor: [0, 0], shadowAnchor: [0, 0], popupAnchor: [10, 0] });
        this.favoriteIcon = window.L.icon({ iconUrl: '/static/img/markers/favorite-marker.svg', iconSize: [20, 29], shadowSize: [20, 29], iconAnchor: [0, 0], shadowAnchor: [0, 0], popupAnchor: [10, 0] });
    }
}