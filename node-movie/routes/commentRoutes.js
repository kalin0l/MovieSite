const express = require('express');
const router = express.Router();
const commentController = require('./../controllers/commentController')


router.get('/notes/:id',commentController.getCommentsByMovieId);
router.post('/notes',commentController.createComment);
router.delete('/notes/:cid',commentController.deleteComment);

module.exports = router