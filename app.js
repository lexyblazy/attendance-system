const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");

const seedDB = require("./seed");
const removeUsers = require("./remove");
const routes = require("./routes/index");
// const generatePDF = require('./generatePdf');
require('dotenv').config({path:'variables.env'});

mongoose.Promise = global.Promise; //tell mongoose to use ES6 promises
mongoose.connect(process.env.DATABASE, err => {
  if (err) {
    console.log("Cannot connect to database");
    console.log(err);
  } else {
    console.log("Connection to database was succesful");
  }
});

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.moment = moment;
  next();
});

//ROUTES
app.use(routes);
// removeUsers();
// seedDB();

app.listen(process.env.PORT, () => {
  console.log("Server is up and running");
});
