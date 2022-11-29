//express
var express = require("express");
var app = express();

//environment
require("dotenv").config();

//helper
var bodyParser = require("body-parser");
var path = require("path");

//database
//db is an object that has all the functions that we export in dbFunctions.js
const db = require("./database/dbFunctions");

db.initialize(db.URL);

// celebrate for validation
const { celebrate, Joi, errors, Segments } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi); // custom MongoDB ObjectId validator for Joi.

//handlebars
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");


//set PORT
var PORT = process.env.PORT || 8000;


//set up app
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: "true" }));


//ROUTES
app.get("/", function (req, res) {
  res.render("index");
});


app.get("/api/restaurants/", function (req, res) {
  let page = req.query.page;
  let perPage = req.query.perPage;
  let borough = req.query.borough;

  db.getAllRestaurants(page, perPage, borough).then((restaurants) => {
    res.status(200).json(restaurants);
  })
  .catch((error) => {
    console.log(error.message)
    res.status(500).json({ statusCode: 500, message: error.message })
  })
});


// find restaurant by id 
app.get("/api/restaurants/:id", celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId() // validate if id is MongoDB object id
  }),
}), function (req, res, next) {

  let id = req.params.id;
  db.getRestaurantById(id).then((restaurant) => {
    res.status(200).json(restaurant);
  })
  .catch((error) => {
    console.log(error)
    res.status(500).json({ statusCode: 500, message: error.message })
  })
});


// display restaurants using template engine
// TODO Display grade by latest date, proper validation
app.get("/restaurants", function (req, res) {
  res.render('display');
});

app.post("/restaurants", celebrate({
  [Segments.BODY]: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    borough: Joi.string()
  }),
}), function (req, res) {
  let page = req.body.page;
  let perPage = req.body.perPage;
  let borough = req.body.borough;

  db.getAllRestaurants(page, perPage, borough).then((restaurants) => {
    res.render('display', { data: restaurants })
  })

});


// Error route for celebrate
app.use(errors());


//START SERVER
app.listen(PORT, () => {
  console.log("Express http server listening on: " + PORT);
});
