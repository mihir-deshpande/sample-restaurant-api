//this file will have everything related to database
//connection
//functions
//app.js will use these functions

// load mongoose since we need it to define functions
var mongoose = require("mongoose");
const restaurant = require("./restaurant");
require("dotenv").config();

const URL = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.l8nlw4g.mongodb.net/sample_restaurants`;

//schema for performing operations on database
var Restaurant = require("./restaurant");


// initialize databse
function initialize(URL) {
  mongoose
    .connect(URL)
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      console.log("Success");
    });
}


// Add a new restarant using json object passed
async function addNewRestaurant(data) {
  return await Restaurant.create({
    address: data.address,
    borough: data.borough,
    cuisine: data.cuisine,
    grades: data.grades,
    name: data.name,
    restaurant_id: data.restaurant_id,
  })
}


// get all restaurnts for a specific page using offset paging 
async function getAllRestaurants(page = 1, perPage = 10, borough = "") {
  // borough is optional parameter 
  if (borough == "") {
    return await Restaurant.find()
      .limit(perPage * 1) // number of documents we want to limit per page 
      .skip((page - 1) * perPage) // number of documents we want to skip 
      .sort('restaurant_id') // sort document by restaurant_id
      .lean()
      .exec();
  }
  else {
    return await Restaurant.find({ borough: borough })
      .limit(perPage * 1)
      .skip((page - 1) * perPage)
      .sort('restaurant_id')
      .lean()
      .exec();
  }
}


// find restaurant by id 
async function getRestaurantById(id) {
  return await Restaurant.findById(id).lean().exec();
}

// update restaurant info
async function updateRestaurantById(data, id) {
  return await Restaurant.findByIdAndUpdate(id, data).exec();
}


// delete restaurant by _id
async function deleteRestaurantById(id) {
  return await Restaurant.deleteOne({ _id: id }).exec();
}

module.exports = {
  URL: URL,
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById
};
