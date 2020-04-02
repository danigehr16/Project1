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

// 2. Button for adding tp searches
$("#add-tp-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var tpstoreName = $("#store-name-input").val().trim();
    var tpaddress = $("#address-input").val().trim();
    var tpsku = $("#sku-input").val().trim();

    // Creates local "temporary" object for holding tp data
    var newTP = {
        name: tpstoreName,
        address: tpaddress,
        sku: tpsku,
    };

    // Uploads tp data to the database
    database.ref().push(newTP);

    alert("TP successfully added");

    // Clears all of the text-boxes
    $("#store-name-input").val("");
    $("#address-input").val("");
    $("#sku-input").val("");
});

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
      var searchProduct = function(product) {
        var queryProdURL = "https://api.wegmans.io/products/search?query=" + product + "&api-version=2018-10-18";
        $.ajax({
          url: queryProdURL,
          method: "GET",
          timeout: 0,
          headers: {
            "Subscription-Key": "C455d00cb0f64e238a5282d75921f27e"
          }
        }).then(function(response) {
          console.log(response);

          console.log(response.results[0]._links[1].href);
          console.log(response.results[0]._links[2].href);
          console.log(response.results[0]._links[3].href);
          var storeHref = response.results[0]._links[0];
          console.log(storeHref);
        });
      };
      searchProduct("toilet-paper");
////////////////////////////////////
      var store = {
        "url": "https://api.wegmans.io/stores?Subscription-Key=C455d00cb0f64e238a5282d75921f27e&api-version=2018-10-18",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(store).done(function (response) {
        console.log(response);
        var a = response.stores[0]._links[0].href;
        console.log(a);
      });