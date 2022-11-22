var express  = require('express');
var mongoose = require('mongoose');
var app   = express();
require('dotenv').config()
var bodyParser = require('body-parser');  
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

var PORT  = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));

app.get('/', function(req, res) {
    res.render("index");
});


app.listen(PORT, () => {
    console.log("Express http server listening on: " + PORT);
});

