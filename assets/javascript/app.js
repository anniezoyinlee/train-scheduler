// Initialize Firebase

var firebaseConfig = {
  apiKey: "AIzaSyBgaHlYGQ-95sFI4-DJ_D45RQHAbLHZHBs",
  authDomain: "train-schedule-annie.firebaseapp.com",
  databaseURL: "https://train-schedule-annie.firebaseio.com",
  projectId: "train-schedule-annie",
  storageBucket: "train-schedule-annie.appspot.com",
  messagingSenderId: "974994374555",
  appId: "1:974994374555:web:c549a50c6fecef07"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// 2. Button for adding new train schedule
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName-input").val().trim();
  var trainDestination = $("#trainDestination-input").val().trim();
  var firstTrain = $("#firstTrain-input").val().trim();
  var trainFrequency = $("#trainFrequency-input").val().trim();

  // Creates local "temporary" object for holding train schedule data
  var newTrainSchedule = {
    name: trainName,
    destination: trainDestination,
    first: firstTrain,
    freq: trainFrequency
  };

  // Uploads train schedule data to the database
  database.ref().push(newTrainSchedule);

  // Logs everything to console
  console.log(newTrainSchedule.name);
  console.log(newTrainSchedule.destination);
  console.log(newTrainSchedule.first);
  console.log(newTrainSchedule.freq);

  alert("New Train Schedule successfully added");

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#trainDestination-input").val("");
  $("#firstTrain-input").val("");
  $("#trainFrequency-input").val("");
});

// 3. Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  //Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().freq;

  // Train Schedule Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrain);
  console.log(trainFrequency);

  var timeArr = firstTrain.split(':');
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

  // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
  var trainDiff = moment().diff(trainTime, "minutes");
  console.log(firstTrain)
  // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
  var trainRemainder = trainDiff % trainFrequency;
  console.log(trainDiff)
  console.log(trainFrequency)
  // subtract the remainder from the frequency, store in var
  var minutesTillArrival = trainFrequency - trainRemainder;
  
  console.log(trainFrequency)
  console.log(trainRemainder)
  // add minutesTillArrival to now, to find next train & convert to standard time format
  var nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

  console.log(trainName, trainDestination, minutesTillArrival, nextTrainTime, trainFrequency)

  $("#table-data").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrainTime + "</td><td>" + minutesTillArrival + "</td></tr>");

});
