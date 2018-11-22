const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:'You must supply a name',
        trim:true
    },
   attendance:[{

       date:{
            type:Date,
            default:Date.now,
        },
        entry:{type:Date},
        exit:{
            time:{
                type:Date
            },
            // 1 - General
            // 2 - Vacation
            // 3 - Doctor
            reason:Number
        }

   }]
}, {
  usePushEach: true
})

module.exports = mongoose.model('User',userSchema);
