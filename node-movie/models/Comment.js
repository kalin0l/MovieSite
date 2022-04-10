const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment:{type:String,required:true},
    creator: {type:mongoose.Types.ObjectId,required:true,ref:'Fav'}
});

module.exports = mongoose.model('Comment',commentSchema);