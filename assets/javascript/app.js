/*
User clicks submit get address input from user CHECK
then call geo api request to get lon and lat of user address 
sort store coords and store
find closest 10 stores to user coords

send second api request to geo with user address and 10 markers with closest stores
*/

// 1. Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBYXHZ_u0F08l7IcwzHpf5unJe_4tYa_Wo",
  authDomain: "tp-search.firebaseapp.com",
  databaseURL: "https://tp-search.firebaseio.com",
  projectId: "tp-search",
  storageBucket: "tp-search.appspot.com",
  messagingSenderId: "922115969314",
  appId: "1:922115969314:web:996eff6737bb582db1557b"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();



// 2. Button for adding TP LL
$("#add-tp-btn").on("click", function (event) {
  event.preventDefault();

  function getLatLon(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("Latitude is " + latitude);
    console.log("Longitude is " + longitude);

    var newTPLL = {
      lat: latitude,
      long: longitude,
    };
    // Uploads tp data to the database
    database.ref().push(newTPLL);

    alert("TP LL successfully added");
  }

  navigator.geolocation.getCurrentPosition(getLatLon);

});

//addition of store data to Database ***************************************************
// var store = {
//   "url": "https://api.wegmans.io/stores?Subscription-Key=C455d00cb0f64e238a5282d75921f27e&api-version=2018-10-18",
//   "method": "GET",
//   "timeout": 0,
// };

// $.ajax(store).done(function (response) {
//   console.log(response);
//   database.ref().push(response);
//   // for (i = 0; i < 6; i++) {
//   //   response.stores[i].latitude;
//   //   response.stores[i].longitude;
//   //   console.log(response.stores[i].latitude);
//   //   console.log(response.stores[i].longitude);
//   // }
// });


// 3. Create Firebase event for adding TP to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tpstoreName = childSnapshot.val().name;
  var tpaddress = childSnapshot.val().address;
  var tpsku = childSnapshot.val().sku;

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(tpstoreName),
    $("<td>").text(tpaddress),
    $("<td>").text(tpsku),
  );

  // Append the new row to the table
  $("#tp-table > tbody").append(newRow);
});


//====================================================================================================================
//APIs
//Milk
/*
var settings = {
  "method": "GET",
  "headers": {
      "Subscription-Key": "C455d00cb0f64e238a5282d75921f27e",
  }
}

settings.url = 'https://api.wegmans.io/products/search?query=Milk&api-version=2018-10-18';

$.ajax(settings).done(function (response) {
  console.log(response);

  // Returns the link with availabilities
  var availabilities = response.results[0]._links.find(function (link) {
      return link.rel === "availabilities";
  })

  console.log(settings.url);
  settings.url = `https://api.wegmans.io${availabilities.href}`
  $.ajax(settings).done(function (availResponse) {
      console.log(availResponse);
  });
});
////////////////////////////////////
*/
//sort data by long and lat in numerical order
//match users input to sorted coords
//find i and add i-2, i-1, i, i+1, i+2




































































































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
      searchText: tpaddress,
      jsonattributes: 1
    };
  console.log(geocoder);

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
  console.log(locations)
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

// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: '8RvbLn7UTJxQGpXktdP6fVl_y5PSyDt__1K5Bt0_j_I'
});
// Retrieve the target element for the map:
var targetElement = document.getElementById('mapContainer');

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: { lat: 39.381266, lng: -97.922211 },
  });
// Create the parameters for the routing request:
var routingParameters = {
  // The routing mode:
  'mode': 'fastest;car',
  // The start point of the route:
  'waypoint0': 'geo!50.1120423728813,8.68340740740811',
  // The end point of the route:
  'waypoint1': 'geo!52.5309916298853,13.3846220493377',
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  'representation': 'display'
};

// Define a callback function to process the routing response:
var onResult = function (result) {
  var route,
    routeShape,
    startPoint,
    endPoint,
    linestring;
  if (result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;

    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();

    // Push all the points in the shape into the linestring:
    routeShape.forEach(function (point) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });

    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;

    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 3 }
    });

    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });

    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });

    // Add the route polyline and the two markers to the map:
    map.addObjects([routeLine, startMarker, endMarker]);

    // Set the map's viewport to make the whole route visible:
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  }
};

// Get an instance of the routing service:
var router = platform.getRoutingService();

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult,
  function (error) {
    alert(error.message);
  });
