/*
User clicks submit get address input from user CHECK
then call geo api request to get lon and lat of user address 
sort store coords and store
find closest 10 stores to user coords

send second api request to geo with user address and 10 markers with closest stores
//sort data by long and lat in numerical order
//match users input to sorted coords
//find i and add i-2, i-1, i, i+1, i+2
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
var stores = firebase.database().ref("-M45lnOTyNUYYVystEzK");

// 2. Button for adding TP LL
$("#add-tp-btn").on("click", function (event) {
  event.preventDefault();

  function getLatLon(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var newTPLL = {
      lat: latitude,
      long: longitude,
    };
    // Uploads tp data to the database
    database.ref().push(newTPLL);
    alert("latitude & longitude successfully added");
  }
  navigator.geolocation.getCurrentPosition(getLatLon);

});

// 3. Create Firebase event for adding TP to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());

  var newUserLat = childSnapshot.val().lat;
  var newUserLong = childSnapshot.val().long;
  
  console.log(newUserLat)
  console.log(newUserLong)
 
  indexOfClosest();
  // var tpstoreName = childSnapshot.val().name;
  // var tpaddress = childSnapshot.val().address;
  //var distance;


  // Create the new row
  // var newRow = $("<tr>").append(
  //   $("<td>").text(tpstoreName),
  //   $("<td>").text(tpaddress),
  // );

  // Append the new row to the table
  //$("#tp-table > tbody").append(newRow);
});

function indexOfClosest(stores, newUserLat) {
  let closest = Number.MAX_SAFE_INTEGER;
  let index = 0;

  stores.forEach((latitude, i) => {
    let dist = Math.abs(newUserLat - latitude);

    if (dist < closest) {
      index = i;
      closest = dist;
    }
  });

  return index;
}

console.log(index);