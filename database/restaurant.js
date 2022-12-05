// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
RestaurantSchema = new Schema({
  address: Object,
  borough: String,
  cuisine: String,
  grades: [
    {
      date: Date,
      grade: String,
      score: Number
    }
  ],
  name: String,
  restaurant_id: String,
});
module.exports = mongoose.model("Restaurant", RestaurantSchema);
