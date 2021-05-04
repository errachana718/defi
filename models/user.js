const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
         _id: mongoose.Schema.Types.ObjectId,
         name: String,
         mobile: String,
         email: String,
         password:String,
         image: String
});

module.exports =  mongoose.model('User', userSchema);