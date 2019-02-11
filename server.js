var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");



// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI);

// Routes
const routes = require("./routes");

app.use(routes);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
