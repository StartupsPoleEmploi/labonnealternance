export class Location {
    constructor(label, zipcode, slug, longitude, latitude, isGeolocated = false) {
        this.label = label;
        this.zipcode = zipcode;
        this.slug = slug;
        this.longitude = longitude;
        this.latitude = latitude;
        this.isGeolocated = isGeolocated;
    }

    isValid() {
        return this.zipcode !== undefined && this.longitude !== undefined && this.latitude !== undefined;
    }
}