const mongoose = require("mongoose");


const addMovieSchema = new mongoose.Schema({
    id:{type:Number,required:true},
    title:{type:String,required:true},
    img:{type:String},
    genre:{type:String},
    runtime:{type:Number},
    summary:{type:String},
    comments: [{type:String,ref:'Comment'}],
    rate: {type:Number,ref:'Rating'}

});

module.exports = mongoose.model('Fav', addMovieSchema);