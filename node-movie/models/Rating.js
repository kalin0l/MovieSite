const mongoose = require("mongoose");


const ratingSchema = new mongoose.Schema({
    rate:{type:Number,required:true},
    creator: {type:mongoose.Types.ObjectId,required:true,ref:'Fav'}
});

module.exports = mongoose.model('Rating',ratingSchema);