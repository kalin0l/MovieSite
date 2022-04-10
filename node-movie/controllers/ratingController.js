const HttpError = require("./../models/HttpError");
const { validationResult } = require("express-validator");
const Rating = require("./../models/Rating");
const Fav = require("./../models/Favourites");

const createRating = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Adding comment failed!", 422);
    return next(error);
  }

  const { rate, creator } = req.body;
  const createRate = new Rating({
    rate,
    creator,
  });
  let rating;
  try {
    rating = await Fav.findById(creator);
  } catch (err) {
    const error = new HttpError("Could not find creator!", 500);
    return next(error);
  }
//   if (!rating) {
//     const error = new HttpError(
//       "Could not find the rate for the movie in db!",
//       500
//     );
//     return next(error);
//   }

  try {
    await createRate.save();
  } catch (err) {
    const error = new HttpError("Saving the rate failed!", 422);
    return next(error);
  }
  res.status(201).json({
      rating: createRate,
      message:'success'
  })
};
const getsRate = async (req, res, next) => {
    const movieId = req.params.id;

    let rate;
    try {
        rate = await Rating.find({creator:movieId})

    }catch(err){
        const error = new HttpError("Getting the rate failed!", 422);
    return next(error);
    }
    if (!rate) {
        const error = new HttpError("There is no for the movie", 404);
        return next(error);
      }
      res.json({
        rate: rate.map((r) => r.toObject({ getters: true })),
        message:'success'
      });
};
const deleteRate = async (req, res, next) => {
    const rateId = req.params.rid;

  let rate;

  try {
    rate = await Rating.findById(rateId).populate('creator');
    console.log(rate)
  } catch (err) {
    const error = new HttpError("Could not remove the rate", 500);
    return next(error);
  }
  console.log(rate)

  if(!rate){
    const error = new HttpError("The rate does not exist!", 404);
    return next(error);
  }

  try {
    //   const sess = await mongoose.startSession();
    //   sess.startTransaction();
    //   await rate.remove({session:sess});
    //   rate.creator.rate.pull(rate);
    //   await rate.creator.save({session:sess});
    //   await sess.commitTransaction()
      await rate.remove();
  }catch(err){
    const error = new HttpError("fail", 500);
    return next(error);
  }
  res.status(200).json({
      message:"Deleted"
  })
};


exports.createRating = createRating;
exports.getsRate = getsRate;
exports.deleteRate = deleteRate;
