const router = require('express').Router();
const User = require('../models/user');
const pdf = require('html-pdf');
const fs = require('fs'),
      path = require('path'),
      ejs = require('ejs'),
      moment = require('moment'),
      juice = require('juice');

//the Home page
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.render("index", { users });
    } catch (error) {
      console.log("Cannot find users");
    }
  });


router.post('/users', async (req,res)=>{
    try {
        if(req.body.name === ""){
            req.flash('error','Name cannot be empty');
            res.redirect('back');
            return;
        }
        const user = new User(req.body);
        await user.save();
        req.flash('success',`${user.name} has been added`);
        res.redirect('/')
    } catch (error) {
        req.flash('error','Something went wrong');
        res.redirect('back')
    }
    
})

  router.get("/user/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      let hours = 0;
      if(user.attendance.length > 0 ){
        user.attendance.reverse();
        user.attendance.map(a =>{
          if(a.entry && a.exit.time){
            hours = hours + calculateHours(a.entry.getTime(),a.exit.time.getTime());
          }
         
        })
        hours = parseFloat(hours /(3600*1000)).toFixed(4); 
      }
      
      res.render("user", { user,hours});
    } catch (error) {
      console.log(error);
      req.flash('error','Cannot find user');
      res.redirect('back')
    }
  });

  router.get('/user/:id/overview', async (req,res)=>{

    try {
      const user = await User.findById(req.params.id);
      const overview = generateUserOverview(user);
      overview.reverse();
      let html = '';
      let options = {
       format: 'Letter'
      };
      ejs.renderFile('./views/useroverviewpdf.ejs', {overview,moment,user}, function(err, result) {
        // render on success
        if (result) {
           html = juice(result);
        }
        // render or error
        else {
           res.end('An error occurred');
           console.log(err);
        }
    });
    let filePath = ""
    pdf.create(html, options).toFile('./user_overview.pdf', function(err, result) {
      if (err) return console.log(err);
      // console.log(result); // { filename: '/app/businesscard.pdf' }
     filePath = result.filename;
      res.download(filePath)
    })

    } catch (error) {
      console.log(error)
    }
   
  })

  //the overview route
  router.get('/overview',async (req,res)=>{
    try {
      const users = await User.find()
      const overview = generateOverview(users);
      res.render('overview',{overview})
    } catch (error) {
      console.log(error);
    }
  })

  //generate pdf route
  router.get('/overview/pdf',async (req,res)=>{
    try {
      const users = await User.find();
      //map over the users array  and return something like
      const overview = generateOverview(users);
      let html = '';
      let options = {
       format: 'Letter'
      };
      ejs.renderFile('./views/overviewpdf.ejs', {overview}, function(err, result) {
        // render on success
        if (result) {
           html = juice(result);
        }
        // render or error
        else {
           res.end('An error occurred');
           console.log(err);
        }
    });
    let filePath = ""
    pdf.create(html, options).toFile('./overview.pdf', function(err, result) {
      if (err) return console.log(err);
      // console.log(result); // { filename: '/app/businesscard.pdf' }
     filePath = result.filename;
      res.download(filePath)
    });

    
   
    } catch (error) {
      console.log(error);
    }
   
  })
  
  //check in
  router.post("/user/:id/enter", async (req, res) => {
    try {
      const data = {
        entry: Date.now()
      };
      const user = await User.findById(req.params.id);
  
      //if the user has an attendance array;
     
      if(user.attendance && user.attendance.length > 0){
      //for a new checkin attendance, the last checkin
      //must be at least 24hrs less than the new checkin time;
          const lastCheckIn = user.attendance[user.attendance.length - 1];
          const lastCheckInTimestamp = lastCheckIn.date.getTime();
          // console.log(Date.now(), lastCheckInTimestamp);
          if (Date.now() > lastCheckInTimestamp + 100) {
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
  router.get("/user/:id/exit", async (req, res) => {
    try {
      const user = await User.findOne({_id:req.params.id});
      res.render('checkout',{user});
    } catch (error) {
      console.log('Cannot find User');
    }
   
  });
  
  router.post("/user/:id/exit", async (req, res) => {
    // the attendance than can be checked out must be last entry in the attendance array
    try {
      const user = await User.findOne({_id:req.params.id});
  
        //check if there is an attendance entry
        if(user.attendance && user.attendance.length > 0){ 
  
          //check whether the exit time of the last element of the attedance entry has a value
            const lastAttendance = user.attendance[user.attendance.length - 1];
            if(lastAttendance.exit.time){
              req.flash('error','You have already signed out today');
              res.redirect(`/user/${req.params.id}`);
              return;
            }
            lastAttendance.exit.time = Date.now();
            lastAttendance.exit.reason = req.body.reason;
            await user.save();
            req.flash('success','You have been successfully signed out')
            res.redirect(`/user/${req.params.id}`);
  
        }else{ //if no entry
          req.flash('error','You do not have an attendance entry ');
          res.redirect('back')
        }
    } catch (error) {
      console.log('Cannot find User');
    }
  });

  
function calculateHours(entryTime,exitTime){
    let time = 0;
    time = time + (exitTime - entryTime);
    return time;
  }

  function generateOverview(users){
    //map over the users array  and return something like
    const overview = []
       users.map(user =>{
      let hours = 0;
      if(user.attendance.length > 0 ){
        user.attendance.map(a =>{
          if(a.entry && a.exit.time){
            hours = hours + calculateHours(a.entry.getTime(),a.exit.time.getTime());
          }
         
        })
        hours = parseFloat(hours /(3600*1000)).toFixed(4); 
        overview.push({user,hours})
      }
    })
    return overview;
  }

  function generateUserOverview(user){
    const overview = []
    user.attendance.map( a=>{
     overview.push({
        date: a.date,
        entry: a.entry,
        exit: a.exit.time,
        reason: a.exit.reason
      })

    })
    return overview;
  }

  module.exports = router;