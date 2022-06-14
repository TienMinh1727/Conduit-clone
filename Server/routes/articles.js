const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');
const favoriteController = require('../controllers/favoriteController');

router.post('/', authController.protect, articleController.add);
router.get('/:id', articleController.getOne);
router.get('/', articleController.getAllArticles);
router.put('/:id', authController.protect, articleController.update);
router.delete('/:id', authController.protect, articleController.remove);

router.get('/comments/:id', commentController.getMany);
router.post('/comments/:id', authController.protect, commentController.add);
router.put('/comments/:id', authController.protect, commentController.update);
router.delete(
  '/comments/:id',
  authController.protect,
  commentController.remove
);

router.post('/:slug/favorite', authController.protect, favoriteController.add);
router.delete(
  '/:slug/unfavorite',
  authController.protect,
  favoriteController.remove
);

module.exports = router;
