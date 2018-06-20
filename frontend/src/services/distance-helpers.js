const EARTH_RADIUS = 6378137; // Earth radius
const M  = (1 / ((2 * Math.PI / 360) * EARTH_RADIUS / 1000 )) / 1000;

export const convertRad = (value) => { return (Math.PI * value) / 180; }

export const computeDistance = (pointA, pointB) => {

    let latA = convertRad(pointA.lat);
    let lonA = convertRad(pointA.lng);
    let latB = convertRad(pointB.lat);
    let lonB = convertRad(pointB.lng);

    let distance = EARTH_RADIUS * (Math.PI/2 - Math.asin( Math.sin(latB) * Math.sin(latA) + Math.cos(lonB - lonA) * Math.cos(latB) * Math.cos(latA)));

    // We want the distance from the center, so we divided the distance by 2
    distance = distance / 2;

    return Math.trunc(distance / 1000);
}

export const computeViewBox = (center, distance) => {
    let latitudeDiff  = computeLatitudeDiff(center.lat, center.lng, distance);
    let longitudeDiff  = computeLongitudeDiff(center.lat, center.lng, -distance);

    return { 'southWest': [center.lat - latitudeDiff, center.lng - longitudeDiff], 'northEast': [center.lat + latitudeDiff, center.lng + longitudeDiff] };
}

export const computeLatitudeDiff = (latitude, distance) => {
    return distance * 1000 * M;
}

export const computeLongitudeDiff = (latitude, longitude, distance) => {
    return (distance * 1000 * M) / Math.cos(latitude * (Math.PI / 180));
}