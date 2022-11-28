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
    res.status(500).send(error.message);
  })
});

// find restaurant by id 
app.get("/api/restaurants/:id", function (req, res) {

  let id = req.params.id;

  db.getRestaurantById(id).then((restaurant) => {
    res.status(200).json(restaurant);
  })
  .catch((error) => {
    console.log(error.message)
    res.status(500).send(error.message);
  })
});


// display restaurants using template engine
// TODO Display grade by latest date, proper validation
app.get("/restaurants", function (req, res) {
  res.render('display');
});

app.post("/restaurants", function (req, res) {
  let page = req.body.page;
  let perPage = req.body.perPage;
  let borough = req.body.borough;

  db.getAllRestaurants(page, perPage, borough).then((restaurants) => {
    res.render('display',{ data: restaurants })
  })
  
});

//START SERVER
app.listen(PORT, () => {
  console.log("Express http server listening on: " + PORT);
});
