//==========================================================================================
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
//==========================================================================================

//==========================================================================================
//creating array for stores
for (i = 0; i < 114; i++) {
  var ref3 = database.ref('stores/' + i + '/name');
  ref3.on('value', gotData_store, errData_store);
  var storeNames = [];

  function gotData_store(store_data) {
    var store = store_data.val();
    storeNames.push(store);
  }
}
function errData_store(err) {
  console.log("Error");
  console.log(err);
}
//==========================================================================================

//==========================================================================================
//creates the latitiude array
for (i = 0; i < 114; i++) {
  var ref = database.ref('stores/' + i + '/latitude');
  ref.on('value', gotData, errData); //binds new events
  var latArray = [];

  function gotData(data) {
    const lats = data.val();
    latArray.push(lats);
  }
}
function errData(err) {
  console.log("Error");
  console.log(err);
}
//==========================================================================================

//==========================================================================================
//creating the array for longitude
for (i = 0; i < 114; i++) {
  var ref_long = database.ref('stores/' + i + '/longitude');
  ref_long.on('value', gotData_long, errData_long); //binds new events
  var longArray = [];
  function gotData_long(data) {
    const longs = data.val();
    longArray.push(longs);
  }
}
function errData_long(err) {
  console.log("Error");
  console.log(err);
}
//==========================================================================================

//==========================================================================================
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

//==========================================================================================
// 3. Create Firebase event for adding TP to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());
  var newUserLat = childSnapshot.val().lat;
  var newUserLong = childSnapshot.val().long;

  if (newUserLat > 0) {

    console.log(newUserLat)
    console.log(newUserLong)

    var closestLong = longArray.reduce(function (prev, curr) {
      return (Math.abs(curr - newUserLong) < Math.abs(prev - newUserLong) ? curr : prev);
    });

    console.log(closestLong);
    var storeIndex = longArray.indexOf(closestLong);
    console.log(storeIndex);
    var locationName = storeNames[storeIndex];
    console.log(locationName);



    var newUserStoreLat = latArray[storeIndex];
    var newUserStoreLong = longArray[storeIndex];

    var x = database.ref('name');
    var newUserStoreInfo = x.push();

    newUserStoreInfo.set({
      storeGeoLat: newUserStoreLat,
      storeGeoLong: newUserStoreLong,
      storeGeoName: locationName,
    });

    console.log(newUserStoreInfo);
  }




  

  //==========================================================================================

  //==========================================================================================
  //table updates
  var tpaddress = " ";
  var tpdistance = " ";
  var tpprice = " ";
  var tpavalibility = " ";

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(locationName),
    $("<td>").text(tpaddress),
    $("<td>").text(tpdistance),
    $("<td>").text(tpprice),
    $("<td>").text(tpavalibility),
  );

  // //Append the new row to the table
  $("#tp-table > tbody").append(newRow);
});