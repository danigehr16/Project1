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