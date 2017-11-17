const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require('moment')

const seedDB = require("./seed");

mongoose.Promise = global.Promise; //tell mongoose to use ES6 promises
const db = "mongodb://127.0.0.1:27017/attendance-system";
mongoose.connect(db, err => {
  if (err) {
    console.log("Cannot connect to database");
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
    secret: "Sweet sesh",
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

async function removeUsers(){
  try {
    await User.remove();
    console.log('All users have been removed');

  } catch (error) {
    console.log('something went wrong')
  }
}

//
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { users });
    // res.json(users)
  } catch (error) {
    console.log("Cannot find users");
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("user", { user });
  } catch (error) {
    console.log("Cannot find User");
  }
});

//check in
app.post("/user/:id/enter", async (req, res) => {
  try {
    const data = {
      entry: Date.now(),
      exit: null
    };
    const user = await User.findById(req.params.id);

    //if the user has an attendance array;
   
    if(user.attendance && user.attendance.length > 0){
    //for a new checkin attendance, the last checkin
    //must be at least 24hrs less than the new checkin time;
        const lastCheckIn = user.attendance[user.attendance.length - 1];
        const lastCheckInTimestamp = lastCheckIn.date.getTime();
        // console.log(Date.now(), lastCheckInTimestamp);
        if (Date.now() > lastCheckInTimestamp + 86400000) {
          user.attendance.push(data);
          await user.save();
          req.flash('success','You have been signed in for today');
          res.redirect('back')
          
        } else {
          req.flash("error", "You have signed in today already");
          res.redirect("back");
        }
    }else{
        user.attendance.push(data);
        await user.save();
        req.flash('success','You have been signed in for today');
        res.redirect('back')
    }
  
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
  }
});

//check out

app.post("/user/:id/exit", async (req, res) => {
  console.log(req.body);
});

// seedDB();
// removeUsers();

app.listen(3000, () => {
  console.log("Server is up and running");
});
