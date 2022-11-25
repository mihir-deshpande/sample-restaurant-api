//this file will have everything related to database
//connection
//functions
//app.js will use these functions

// load mongoose since we need it to define functions
var mongoose = require("mongoose");
require("dotenv").config();

const URL = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.l8nlw4g.mongodb.net/sample_restaurants`;

mongoose
  .connect(URL)
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("Success");
  });

//schema for performing operations on database
var Restaurant = require("./restaurant");

module.exports = { URL: URL };
