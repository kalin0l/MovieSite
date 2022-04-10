const Fav = require("./../models/Favourites");
const { validationResult } = require("express-validator");
const HttpError = require("./../models/HttpError");

const getMovie = async (req, res, next) => {
  let movies;
  try {
    movies = await Fav.find();
  } catch (err) {
    const error = new HttpError("Cannot get the movies", 422);
    return next(error);
  }
  res.status(200).json({favMovies: movies.map(movie => movie.toObject({ getters: true })) })
};
const addToFav = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Adding to favourites failed!", 422);
    return next(error);
  }

  const { id, title, img, genre, runtime, summary } = req.body;

  const newFavMov = new Fav({
    id,
    title,
    img,
    genre,
    runtime,
    summary,
    comments:[]
  });

  try {
    await newFavMov.save();
  } catch (err) {
    const error = new HttpError("Could not add the movie", 500);
    return next(error);
  }

  res.status(201).json({
    movie: newFavMov,
    message: "added",
  });
};

const deleteMovie = async (req,res,next) => {
    const movieId = req.params.id;

    let movie

    try {
      movie = await Fav.findById(movieId);
      // console.log(movie);
    }catch(err){
        const error = new HttpError('Deleting failed!',422);
        return next(error);
    }
    console.log(movie);
    if(!movie){
      const error = new HttpError('no movie!',422);
        return next(error);
    }

    try {
       await movie.remove();
    }catch(err){
        const error = new HttpError('unsuccessful!!',422);
        return next(error);
    }


    res.status(200).json({
        message: 'deleted successfully'
    })

}

exports.deleteMovie = deleteMovie;
exports.addToFav = addToFav;
exports.getMovie = getMovie;
