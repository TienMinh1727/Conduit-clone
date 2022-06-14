const express = require('express');
const router = express.Router();
const ProfileRouter = require('../controllers/profileController');
const authController = require('../controllers/authController');

router.post('/:id/follow', authController.protect, ProfileRouter.follow);

router.delete('/:id/unfollow', authController.protect, ProfileRouter.unfollow);

module.exports = router;
