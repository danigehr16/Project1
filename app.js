// 1. Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDGHSJCWI0-CpE8J-3Qdpxr-D9GiCDQZyc",
    authDomain: "train-scheduler-f1866.firebaseapp.com",
    databaseURL: "https://train-scheduler-f1866.firebaseio.com",
    projectId: "train-scheduler-f1866",
    storageBucket: "train-scheduler-f1866.appspot.com",
    messagingSenderId: "270883119658",
    appId: "1:270883119658:web:2c397d9201aa55b85b1953"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-tp-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trnName = $("#train-name-input").val().trim();
    var trnDestination = $("#destination-input").val().trim();
    var trnStart = $("#start-input").val().trim();
    var trnFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trnName,
        destination: trnDestination,
        start: trnStart,
        frequency: trnFrequency,
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trnName = childSnapshot.val().name;
    var trnDestination = childSnapshot.val().destination;
    var trnStart = childSnapshot.val().start;
    var trnFrequency = childSnapshot.val().frequency;

     // First Time (pushed back 1 year to make sure it comes before current time)
     var firstTimeConverted = moment(trnStart, "HH:mm").subtract(1, "years");
     console.log("First Time Converted: " + firstTimeConverted);
 
     var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
     var tRemainder = diffTime % trnFrequency;
 
     // Minute Until Train
     var tMinutesTillTrain = trnFrequency - tRemainder;
     console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
 
     // Next Train
     var nextTrain = moment().add(tMinutesTillTrain, "minutes");
     moment(nextTrain).format("HH:mm");
     console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    
    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trnName),
        $("<td>").text(trnDestination),
        $("<td>").text(trnFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});