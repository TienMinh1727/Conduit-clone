const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.follow = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.user._id);
  if (req.user._id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);
      if (!user.followers.includes(req.user._id)) {
        await user.updateOne({ $push: { followers: req.user._id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json(' Hurray !, User has been Followed !');
      } else {
        res.status(403).json({
          success: false,
          msg: 'You already follow this user !',
        });
      }
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  } else {
    res.status(403).json('You Cannot follow yourself !');
  }
});

exports.unfollow = catchAsync(async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      if (user.followers.includes(req.user._id)) {
        await user.updateOne({ $pull: { followers: req.user._id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });

        res.status(200).json({
          status: 200,
          message: 'User has been Unfollowed !',
        });
      } else {
        res.status(403).json('You dont follow this user !');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You cannot unfollow yourself !');
  }
});
