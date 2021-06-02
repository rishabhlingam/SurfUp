mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: geometry.coordinates, // starting position [-74.5, 40], surfsite.geometry.coordinates
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker().setLngLat(geometry.coordinates).addTo(map);
