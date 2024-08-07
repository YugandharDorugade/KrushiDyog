const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email :{
        type :String,
        required :true
    }
});
// to implement automatically  username, hashing, salting  pluugin is used
userSchema.plugin(passportLocalMongoose);
module.exports =mongoose.model('User',userSchema);