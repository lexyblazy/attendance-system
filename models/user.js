const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String, 
    },
   attendance:[{

       date:{
            type:Date,
            default:Date.now,
        },
        entry:{type:Date},
        exit:{ type:Date,reason:String}    
  
   }]
})

module.exports = mongoose.model('User',userSchema);