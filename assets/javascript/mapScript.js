/**
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function geocode(platform) {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      //this will need to be updated for the users input
      searchText: '6203 Grey Friars Terrace, Chalfont PA, 18914',
      jsonattributes : 1
    };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
  var locations = result.response.view[0].result;
// this is where we will add the location of the stores
//in addition we will add the location code from the other google doc.
  addLocationsToMap(locations);
  addLocationsToPanel(locations);
  
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey:  '8RvbLn7UTJxQGpXktdP6fVl_y5PSyDt__1K5Bt0_j_I'
});
var defaultLayers = platform.createDefaultLayers();

//this map is centered over the US, kansas more specifically
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:39.381266, lng:-97.922211},
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

var locationsContainer = document.getElementById('panel');

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
//we can change this icon to anything in the correct folder
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

/**
 * Creates a series of list items for each location found, and adds it to the panel.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToPanel(locations){

  var nodeOL = document.createElement('ul'),
    i;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';


   for (i = 0;  i < locations.length; i += 1) {
     var li = document.createElement('li'),
        divLabel = document.createElement('div'),
        address = locations[i].location.address,
        content =  '<strong style="font-size: large;">' + address.label  + '</strong></br>';
        position = {
          //coordinates for locations
          lat: locations[i].location.displayPosition.latitude,
          lng: locations[i].location.displayPosition.longitude
        };

        //house address for user
      content += '<strong>houseNumber:</strong> ' + address.houseNumber + '<br/>';
      content += '<strong>street:</strong> '  + address.street + '<br/>';
      content += '<strong>district:</strong> '  + address.district + '<br/>';
      content += '<strong>city:</strong> ' + address.city + '<br/>';
      content += '<strong>postalCode:</strong> ' + address.postalCode + '<br/>';
      content += '<strong>county:</strong> ' + address.county + '<br/>';
      content += '<strong>country:</strong> ' + address.country + '<br/>';
      content += '<br/><strong>position:</strong> ' +
        Math.abs(position.lat.toFixed(4)) + ((position.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(position.lng.toFixed(4)) + ((position.lng > 0) ? 'E' : 'W');

      divLabel.innerHTML = content;
      li.appendChild(divLabel);

      nodeOL.appendChild(li);
  }

  locationsContainer.appendChild(nodeOL);
}


/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToMap(locations){
  var group = new  H.map.Group(),
    position,
    i;

  // Add a marker for each location found
  // this is where we can add a little tp icon

  for (i = 0;  i < locations.length; i += 1) {
    position = {
      lat: locations[i].location.displayPosition.latitude,
      lng: locations[i].location.displayPosition.longitude
    };
    marker = new H.map.Marker(position);
    marker.label = locations[i].location.address.label;
    group.addObject(marker);
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
       evt.target.getGeometry(), evt.target.label);
  }, false);

  // Add the locations group to the map
  map.addObject(group);
  map.setCenter(group.getBoundingBox().getCenter());
}

// Now use the map as required...
geocode(platform);
