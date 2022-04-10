const express = require('express');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const mongoose = require("mongoose");
const HttpError = require('./models/HttpError')



const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  
    next();
  });

app.use('/api/movies/',movieRoutes);
app.use('/api/movies/',commentRoutes);
app.use('/api/movies/',ratingRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this path", 404);
    return next(error);
  });
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({
      message: error.message || "Unknown error occured!",
    });
  });

mongoose
  .connect(
    "mongodb+srv://aleksiev:translat123456@cluster0.1shec.mongodb.net/movies?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
