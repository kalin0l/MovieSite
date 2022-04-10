const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController')


router.get('/favourites',movieController.getMovie);
router.post('/favourites',movieController.addToFav);
router.delete('/favourites/:id',movieController.deleteMovie);

module.exports = router;