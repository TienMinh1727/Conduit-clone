const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const article = require('../models/article');

router.use(authController.protect);

router.get('/getTags', function (req, res, next) {
  article
    .find()
    .distinct('tagList')
    .then(function (tags) {
      return res.json({ tags: tags });
    })
    .catch(next);
});

module.exports = router;
