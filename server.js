var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

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
mongoose.connect("mongodb://localhost/netflixScraper", { useNewUrlParser: true });

// Routes

app.get("/", function(req, res) {
  db.Movie.find({ saved: false })
    .then(function(dbMovies) {
      res.render("home", { movies: dbMovies });
    });
});

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://editorial.rottentomatoes.com/guide/best-netflix-movies-to-watch-right-now/").then(function (response) {

    var $ = cheerio.load(response.data);

    $("div.countdown-item").each(function (i, element) {
      var poster = $(element).find("img").attr("src");
      var title = $(element).find("div.countdown-item-content").find("h2").find("a").text();
      var rank = $(element).find("div.countdown-item-content").find("div.countdown-index").text();
      var tomatosRank = $(element).find("div.countdown-item-content").find("span.tMeterScore").text();
      var consensus = $(element).find("div.countdown-item-content").find("div.critics-consensus").text();

      //##### IF THE SCRAPE IS SUCCESSFUL AND RETURNS ALL OF THE REQUIRED DATA...  #####
      if (poster && title && rank && tomatosRank && consensus) {
        //#####  ...INSERT THAT DATA INTO OUR COLLECTION/TABLE  #####
        db.Movie.create({
          poster: poster,
          title: title,
          rank: rank,
          tomatosRank: tomatosRank,
          consensus: consensus
        });
      }
    });
  });
});

// Route for getting all Movies from the db
app.get("/movies", function (req, res) {
  // Grab every document in the Movies collection
  db.Movie.find({})
    .then(function (data) {
      // If we were able to successfully find Movies, send them back to the client
      // For each one
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  db.Movie.find({ saved: true })
    .then(function(dbMovies) {
      res.render("saved", { movies: dbMovies });
    });
});

// Route for grabbing a specific Movie by id, populate it with it's note
app.get("/movies/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Movie.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (data) {
      // If we were able to successfully find an Movie with the given id, send it back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Movie's associated Note
app.post("/movies/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Movie with an `_id` equal to `req.params.id`. Update the Movie to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Movie.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (data) {
      // If we were able to successfully update an Movie, send it back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
