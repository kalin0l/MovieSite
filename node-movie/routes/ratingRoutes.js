const express = require('express');
const router = express.Router();
const ratingController = require('./../controllers/ratingController')



router.get('/ratings/:id',ratingController.getsRate);
router.post('/ratings',ratingController.createRating);
router.delete('/ratings/:rid',ratingController.deleteRate);

module.exports = router