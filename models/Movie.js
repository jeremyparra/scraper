var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var movieSchema = new Schema({

  poster: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  tomatosRank: {
    type: String,
    required: true
  },
  consensus: {
    type: String,
    required: true
  },
  saved: {
      type: Boolean,
      required: false,
      default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


// This creates our model from the above schema, using mongoose's model method
var Movie = mongoose.model("Movie", movieSchema);

// Export the Movie model
module.exports = Movie;