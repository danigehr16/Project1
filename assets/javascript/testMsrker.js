/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addMarkersToMap(map) {
    var store1Marker = new H.map.Marker({lat:48.8567, lng:2.3508});
    map.addObject(store1Marker);

    var store2Marker = new H.map.Marker({lat:41.9, lng: 12.5});
    map.addObject(store2Marker);

    var store3Marker = new H.map.Marker({lat:52.5166, lng:13.3833});
    map.addObject(store3Marker);

    var store4Marker = new H.map.Marker({lat:40.4, lng: -3.6833});
    map.addObject(store4Marker);

    var store5Marker = new H.map.Marker({lat:51.5008, lng:-0.1224});
    map.addObject(store5Marker);
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: '8RvbLn7UTJxQGpXktdP6fVl_y5PSyDt__1K5Bt0_j_I'
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:39.381266, lng:-97.922211},
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
window.onload = function () {
  addMarkersToMap(map);
}  