import debounce from 'lodash/debounce';

// Initiate the window.L variable
// eslint-disable-next-line
import { leaflet } from 'mapbox.js';
import { MarkerClusterGroup } from 'leaflet.markercluster';

import store from './store';
import { CompanyDetailsService } from './company_details/company_details.service';

import { VisitedSiretService } from '../services/visited_sirets/visited_sirets.service';

import { computeDistance, computeViewBox } from '../services/distance-helpers';
import { GoogleAnalyticsService } from './google_analytics.service';

// Trigger when the user click on the popup
window.selectSiret = (el) => {
    if (!el) return;
    let siret = el.getAttribute('data-siret');

    if (siret) CompanyDetailsService.setCompanySiret(siret);
};


export class MapBoxService {

    constructor(id, accessToken, parentComponent) {
        // Add mapbox CSS to the page
        this.addMapboxCssFile();
        this.initIcons();

        // Default value
        this.MAX_DISTANCE = 3000;
        this.DEFAULT_DISTANCE = 50;
        this.DEFAULT_ZOOM = 12;
        this.DISTANCE_GAP_FOR_RELOAD = 0.5; // Minimum distance for reload
        this.currentCenter = undefined;

        this.id = id;
        this.accessToken = accessToken;
        this.parentComponent = parentComponent;

        this.map = undefined; // No map yet

        // We use lodash.debounce() to get new companies
        // only if user don't move the map for 0.300 second
        this.newCompaniesFn = debounce(this.getNewCompanies, 300);

        // Markers store and clusters
        this.markers = new Map();
        this.CLUSTERS_ID = 'CLUSTERS_ID';
        this.CLUSTERS_OPTS = { id: this.CLUSTERS_ID, maxClusterRadius: 30 };
        this.clusters = new MarkerClusterGroup(this.CLUSTERS_OPTS);

        // Store the visited companies
        this.siretsVisited = new Map();
        store.subscribe(() => {
            const newSiretsVisited = store.getState().visitedSirets;
            if(newSiretsVisited.size !== this.siretsVisited.size) {
                this.siretsVisited = store.getState().visitedSirets;
            }
        });


        // LISTENERS
        // When a company is selected, we saved it (for gray marker)
        this.companySelected = null;
        store.subscribe(() => {
            const company = store.getState().companyDetails;
            if (company === null && this.companySelected !== null) {
                this.companySelected = null;
            } else if(company !== null && this.companySelected === null) {
                this.setAsSelected(company);
            } else if(company === null && this.companySelected !== null && this.companySelected.siret !== company.siret) {
                this.setAsSelected(company);
            } else {
                this.companySelected = null;
            }
        });
    }

    createMap(longitude, latitude, distance=undefined) {
        this.currentCenter = { lat: latitude, lng: longitude };

        this.map = window.L.map(this.id).setView([latitude, longitude], this.DEFAULT_ZOOM).setMinZoom(7);

        window.L.tileLayer('https://maps.labonneboite.pole-emploi.fr/styles/osm-bright/{z}/{x}/{y}.png').addTo(this.map);

        // Compute viewBox
        if(distance) this.setFitBounds(distance);

        // Add the search center
        this.currentPositionMarker = window.L.marker([ latitude , longitude ], { icon: this.cyanIcon, interactive: false });
        this.currentPositionMarker.addTo(this.map);

        this.map.on('dragend', () => this.newCompaniesFn());
        this.map.on('zoomend', () => {
            GoogleAnalyticsService.sendEvent({ category: 'Map', action: 'Use zoom' });
            this.newCompaniesFn(true)
        });
    }


    setFitBounds(distance) {
        let viewBox = computeViewBox(this.currentCenter, distance);
        this.map.fitBounds([viewBox.southWest, viewBox.northEast]);
    }


    // MARKERS
    addMarker(company) {
        let icon = this.determineMarkerIcon(company.siret);
        let marker = window.L.marker([ company.latitude , company.longitude ], { company, icon });

        // Change color on click
        marker.on('click', (event) => {
            let siret = event.target.options.company;
            if (siret) {
                CompanyDetailsService.setCompany(company);
                this.setPinkMarker(siret);
            }
        });

        // Save the marker
        this.markers.set(company.siret, marker);

        // Add to the cluster layer
        this.clusters.addLayer(marker);
        this.map.addLayer(this.clusters);
    }

    setAsSelected(company) {
        this.companySelected = company;
        VisitedSiretService.addVisited(company.siret);
        this.markers.get(company.siret).setIcon(this.determineMarkerIcon(company.siret));
    }

    // Favorite Icon ? Gray icon ? Default icon ?
    determineMarkerIcon(siret) {
        if (store.getState().favorites.has(siret)) return this.favoriteIcon;
        if (store.getState().visitedSirets.has(siret)) return this.grayIcon;
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
        this.map.removeLayer(this.clusters);
        this.clusters = new MarkerClusterGroup(this.CLUSTERS_OPTS);
        this.map.addLayer(this.clusters);
    }

    move(direction) {
        let center = this.map.getCenter();
        let newCenter = { lat: center.lat, lng: center.lng };

        let longitude_delta = center.lng - this.map.getBounds().getNorthWest().lng;
        let latitude_delta  = center.lat - this.map.getBounds().getNorthWest().lat;

        if(direction === 'left') { newCenter.lng -= longitude_delta; }
        else if(direction === 'top') { newCenter.lat -= latitude_delta; }
        else if(direction === 'right') { newCenter.lng += longitude_delta; }
        else if(direction === 'bottom') { newCenter.lat += latitude_delta; }

        this.center = newCenter;
        this.map.flyTo([newCenter.lat, newCenter.lng]);
    }


    getNewCompanies(force) {
        let center = this.map.getCenter();

        // Reload if distance between the last center is at least x km
        if(!force) {
            let distanceLastCenter = computeDistance(center, this.currentCenter);
            if (distanceLastCenter <= this.DISTANCE_GAP_FOR_RELOAD) return;
        }

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
        let latitudeDistance = computeDistance(bounds.getNorthWest(), bounds.getNorthEast());
        let longitudeDistance = computeDistance(bounds.getNorthWest(), bounds.getSouthEast());

        return Math.min(latitudeDistance, longitudeDistance);
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
