const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String, 
    },
    time:{
        type:Date,
        default:Date.now
    },
    direct:Boolean,
    type:String,
})

module.exports = mongoose.model('User',userSchema);