const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //tell mongoose to use ES6 promises
const db = 'mongodb://127.0.0.1:27017/attendance-system'
mongoose.connect(db,(err)=>{
    if(err){
        console.log('Cannot connect to database');
    }else{
        console.log('Connection to database was succesful');
    }
})


const User =  require('./models/user');



app.use(express.static(`${__dirname}/public`));
app.set('view engine','ejs');
app.set('views',`${__dirname}/views`)

app.get('/',(req,res)=>{
    res.render('index');
})

const user = new User();
user.name = "lexy";
user.direct="true"


app.listen(3000,()=>{
    console.log("Server is up and running")
})