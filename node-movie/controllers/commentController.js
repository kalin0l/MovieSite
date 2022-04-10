const Comment = require("./../models/Comment");
const Fav = require("./../models/Favourites");
const { validationResult } = require("express-validator");
const HttpError = require('./../models/HttpError')
const mongoose = require("mongoose");

const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Adding comment failed!", 422);
    return next(error);
  }

  const { comment, creator } = req.body;
  const createCom = new Comment({
    comment,
    creator,
  });
  let fav;
  try {
    fav = await Fav.findById(creator);
  } catch (err) {
    const error = new HttpError("Could not find the fav movie!", 500);
    return next(error);
  }
  if (!fav) {
    const error = new HttpError("Could not find the fav movie in db!", 500);
    return next(error);
  }

  try {
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //  await createCom.save({session:sess});
  //  fav.comments.push(createCom);
  //  await fav.save({session:sess});
  //  await sess.commitTransaction()
    await createCom.save();
  } catch (err) {
    const error = new HttpError("Saving the comment failed!", 422);
    return next(error);
  }

  res.status(201).json({
    comments: createCom,
    message: "added",
  });
};
const getCommentsByMovieId = async (req, res, next) => {
  const movieId = req.params.id;
  let comments;
  try {
    comments = await Comment.find({ creator: movieId });
  } catch (err) {
    const error = new HttpError("Could not find the movie", 500);
    return next(error);
  }
  if (!comments) {
    const error = new HttpError("Could not comments for the movie", 404);
    return next(error);
  }
  res.json({
    comments: comments.map((comm) => comm.toObject({ getters: true })),
  });
};
const deleteComment = async (req, res, next) => {
  const commentId = req.params.cid;

  let comment;

  try {
    comment = await Comment.findById(commentId).populate('creator');
  } catch (err) {
    const error = new HttpError("Could not remove the comment", 500);
    return next(error);
  }

  if(!comment){
    const error = new HttpError("The comment does not exist!", 404);
    return next(error);
  }

  try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await comment.remove({session:sess});
      comment.creator.comments.pull(comment);
      await comment.creator.save({session:sess});
      await sess.commitTransaction()
    //   await comment.remove();
  }catch(err){
    const error = new HttpError("fail", 500);
    return next(error);
  }
  res.status(200).json({
      message:"Deleted"
  })
};


exports.createComment = createComment;
exports.getCommentsByMovieId = getCommentsByMovieId;
exports.deleteComment = deleteComment;
