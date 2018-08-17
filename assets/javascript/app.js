// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB9q4ou7ABCPssTgI5vRQXL0yFLVUG1llY",
    authDomain: "train-schedule-83995.firebaseapp.com",
    databaseURL: "https://train-schedule-83995.firebaseio.com",
    projectId: "train-schedule-83995",
    storageBucket: "train-schedule-83995.appspot.com",
    messagingSenderId: "1081402781128"
  };
  firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainFirst = $("#first-train-input").val().trim();
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    first: trainFirst,
    frequency: trainFreq
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainFirst = moment(childSnapshot.val().first, "HH:mm").subtract(1, "years");
  var trainFreq = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainFirst);
  console.log(trainFreq);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var topRows = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain)
  )

  // Append the new row to the table
  $("#schedule-table > tbody").append(topRows);
});