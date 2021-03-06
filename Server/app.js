require('dotenv').config();
const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profiles');
const articlesRouter = require('./routes/articles');
const tagsRouter = require('./routes/tags');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => console.log('MongoDB connection established'))
  .catch((err) => console.log(err));

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'pug');

app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/tags', tagsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error
  console.log(err);
  res.status(err.status || 500);
  res.send({
    errors: {
      body: [err.message],
    },
  });
});

module.exports = app;
