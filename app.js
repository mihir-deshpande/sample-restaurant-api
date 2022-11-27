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


//START SERVER
app.listen(PORT, () => {
  console.log("Express http server listening on: " + PORT);
});
