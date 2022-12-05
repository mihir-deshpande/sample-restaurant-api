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
const { celebrate, Joi, errors, Segments } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi); // custom MongoDB ObjectId validator for Joi.

//security features
const User = require("./database/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//handlebars
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

//set PORT
var PORT = process.env.PORT || 8000;

//set up app
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());

//ROUTES
app.get("/", function (req, res) {
  res.render("index");
});

app.get(
  "/api/restaurants/",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().min(1).required(),
      perPage: Joi.number().min(1).required(),
      borough: Joi.string(),
    }),
  }),
  function (req, res) {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let borough = req.query.borough;

    db.getAllRestaurants(page, perPage, borough)
      .then((restaurants) => {
        res.status(200).json(restaurants);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json({ statusCode: 500, message: error.message });
      });
  }
);

// find restaurant by id
app.get(
  "/api/restaurants/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.objectId(), // validate if id is MongoDB object id
    }),
  }),
  function (req, res, next) {
    let id = req.params.id;
    db.getRestaurantById(id)
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: error.message });
      });
  }
);

// display restaurants using template engine
// TODO Display grade by latest date, proper validation
app.get("/restaurants", function (req, res) {
  res.render("display");
});
app.post(
  "/restaurants",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      page: Joi.number().min(1).required(),
      perPage: Joi.number().min(1).required(),
      borough: Joi.string().allow("").optional(),
    }),
  }),
  function (req, res) {
    let page = req.body.page;
    let perPage = req.body.perPage;
    let borough = req.body.borough;

    db.getAllRestaurants(page, perPage, borough).then((restaurants) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      restaurants.forEach((restaurant) => {
        console.log(restaurant.name);
        restaurant.grades.forEach((object) => {
          if (object.date == null) {
            object.date = "not given";
          } else {
            object.date =
              months[object.date.getMonth()] +
              " " +
              object.date.getDate() +
              " " +
              object.date.getFullYear();
          }
        });
      });
      res.render("display", { data: restaurants });
    });
  }
);

//Route to add new data
//TODO complete celebrate
app.post(
  "/api/restaurants",
  // celebrate({
  //   [Segments.BODY]: Joi.object().keys({
  //     //address is object
  //     //grades is array
  //   }),
  // }),
  function (req, res) {
    const data = {
      address: req.body.address,
      borough: req.body.borough,
      cuisine: req.body.cuisine,
      grades: req.body.grade,
      name: req.body.name,
      restaurant_id: req.body.restaurant_id,
    };
    db.addNewRestaurant(data)
      .then((restaurant) => {
        res.status(201).json(restaurant);
      })
      .catch((error) => {
        res.status(500).json({ statusCode: 500, message: error.message });
      });
  }
);

//Route to update with id
//TODO complete celebrate
app.put(
  "/api/restaurants/:id",
  // celebrate({
  //   [Segments.BODY]: Joi.object().keys({
  //     //address is object
  //     //grades is array
  //   }),
  // }),
  async function (req, res) {
    console.log(req.body);
    const data = {
      address: req.body.address,
      borough: req.body.borough,
      cuisine: req.body.cuisine,
      grades: req.body.grade,
      name: req.body.name,
      restaurant_id: req.body.restaurant_id,
    };

    db.updateRestaurantById(data, req.params.id)
      .then((restaurant) => {
        console.log(restaurant._id.toString());
        return db.getRestaurantById(restaurant._id.toString());
      })
      .then((result) => {
        console.log(result);
        res.status(201).json(result);
      })
      .catch((error) => {
        res.status(500).json({ statusCode: 500, message: error.message });
      });
  }
);

//Route to delete by id
app.delete(
  "/api/restaurants/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.objectId(), // validate if id is MongoDB object id
    }),
  }),
  function (req, res) {
    db.deleteRestaurantById(req.params.id)
      .then((restarant) => {
        res.status(200).json({ statusCode: 200, message: "Deleted" });
      })
      .catch((error) => {
        res.status(500).json({ statusCode: 500, message: error.message });
      });
  }
);

// Register
app.post(
  "/register",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().min(4).alphanum().required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    }),
  }),
  async (req, res) => {
    try {
      // Get user input
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      } else {
        //Encrypt user password
        const salt = await bcrypt.genSalt(10);
        encryptedPassword = await bcrypt.hash(password, salt);

        // Create user in our database
        const user = await User.create({
          name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.ACCESS_TOKEN,
          { expiresIn: "4h" }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// Login
app.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }), // validate email
      password: Joi.string().min(4).alphanum().required(), // validate password
    }),
  }),
  async (req, res) => {
    try {
      var email = req.body.email;
      var password = req.body.password;

      // Validate if user exist in our database
      const user = await User.findOne({ email });

      // compare user credentials with database
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.ACCESS_TOKEN,
          { expiresIn: "4h" }
        );
        // save user token
        user.token = token;
        // user
        res.status(200).json(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// Middleware to verify access token
function verifyToken(req, res, next) {
  const accessToken =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!accessToken) {
    return res
      .status(403)
      .send({ statusCode: 403, message: "Missing Authentication Token" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN); // verify access token
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({
      statusCode: 401,
      message: `Invalid Authentication Token! ${err}`,
    });
  }
  return next();
}

//BONUS FRONT END
const axios = require("axios");

//give user option to choose operation
app.get("/gui", (req, res) => {
  res.render("gui");
});
app.post("/gui", (req, res) => {
  console.log(req.body);
  switch (req.body.type) {
    case "add":
      res.render("add");
      break;
    case "view":
      res.render("view");
      break;
    case "update":
      res.render("update");
      break;
    case "delete":
      res.render("delete");
      break;
  }
});

app.post("/gui/add", (req, res) => {
  let data = {
    address: {
      building: req.body.buildingNumber,
      coord: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)],
      street: req.body.street,
      zipcode: req.body.zipcode,
    },
    borough: req.body.borough,
    cuisine: req.body.cuisine,
    grade: [
      {
        date:
          req.body.date == ""
            ? new Date()
            : new Date(req.body.date),
        grade: req.body.grade,
        score: parseFloat(req.body.score),
      },
    ],
    name: req.body.name,
    restaurant_id: req.body.restaurant_id,
  };
  console.log(data.grade[0].date);

  axios({
    method: "post",
    url: `${req.headers.origin}/api/restaurants`,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    res.render("record", { data: response.data });
  });
});

app.post("/gui/update", (req, res) => {
  const data = {
    address: {
      building:
        req.body.buildingNumber == "" ? undefined : req.body.buildingNumber,
      coord: [
        req.body.latitude == "" ? undefined : parseFloat(req.body.latitude),
        req.body.longitude == "" ? undefined : parseFloat(req.body.longitude),
      ],
      street: req.body.street == "" ? undefined : req.body.street,
      zipcode: req.body.zipcode == "" ? undefined : req.body.zipcode,
    },
    borough: req.body.borough == "" ? undefined : req.body.borough,
    cuisine: req.body.cuisine == "" ? undefined : req.body.cuisine,
    grade: [
      {
        date:
        req.body.date == ""
          ? new Date()
          : new Date(req.body.date),
        grade: req.body.grade == "" ? undefined : req.body.grade,
        score: req.body.score == "" ? undefined : parseFloat(req.body.score),
      },
    ],
    name: req.body.name == "" ? undefined : req.body.name,
    restaurant_id:
      req.body.restaurant_id == "" ? undefined : req.body.restaurant_id,
  };

  axios({
    method: "put",
    url: `${req.headers.origin}/api/restaurants/${req.body.id}`,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    res.render("record", { data: response.data });
  });
});

app.post("/gui/delete", (req, res) => {
  axios({
    method: "delete",
    url: `${req.headers.origin}/api/restaurants/${req.body.id}`,
  }).then((response) => {
    res.json(response.data);
  });
});

app.post("/gui/view", (req, res) => {
  axios({
    method: "get",
    url: `${req.headers.origin}/api/restaurants/${req.body.id}`,
  }).then((response) => {
    console.log(response.data)
    res.render("record", { data: response.data });
  });
});

// Error route for celebrate
app.use(errors());

//START SERVER
app.listen(PORT, () => {
  console.log("Express http server listening on: " + PORT);
});
