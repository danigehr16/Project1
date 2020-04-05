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