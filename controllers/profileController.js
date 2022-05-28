const UserModel = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const FollowingModel = require("./../models/following");
const FollowerModel = require("./../models/follower");

exports.follow = catchAsync(async (req, res, next) => {
  const username = req.params.username;

  if (!username) return next(new AppError("Please specify username"));

  let otherUserDocument;
  try {
    otherUserDocument = await UserModel.findOne({ username });

    if (otherUserDocument === null)
      return next(new AppError(`User with username ${username} not found`));

    if (otherUserDocument._id.toString() === req.user.userId)
      return next(new AppError("Cannot follow self"));

    const followingDocument = await FollowingModel.findOneAndUpdate(
      { _id: req.user.userId },
      { $addToSet: { followings: otherUserDocument._id } },
      { upsert: true, new: true }
    );

    const followerDocument = await FollowerModel.findOneAndUpdate(
      { _id: otherUserDocument._id },
      { $addToSet: { followers: req.user.userId } },
      { upsert: true, new: true }
    );

    await UserModel.findByIdAndUpdate(req.user.userId, {
      following: followingDocument.followings.length,
    });

    otherUserDocument.followers = followerDocument.followers.length;
    await otherUserDocument.save();

    res.json(getApiResponse(otherUserDocument, true));
  } catch (err) {
    return next(err);
  }
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (!username) return next(new AppError("Please specify username"));

  let otherUserDocument;
  try {
    otherUserDocument = await UserModel.findOne({ username });

    if (otherUserDocument === null)
      return next(new AppError(`User with username ${username} not found`));

    if (otherUserDocument._id.toString() === req.user.userId)
      return next(new AppError("Cannot unfollow self"));

    const followingDocument = await FollowingModel.findOneAndUpdate(
      { _id: req.user.userId },
      { $pull: { followings: otherUserDocument._id } },
      { upsert: true, new: true }
    );

    const followerDocument = await FollowerModel.findOneAndUpdate(
      { _id: otherUserDocument._id },
      { $pull: { followers: req.user.userId } },
      { upsert: true, new: true }
    );

    await UserModel.findByIdAndUpdate(req.user.userId, {
      following: followingDocument.followings.length,
    });

    otherUserDocument.followers = followerDocument.followers.length;
    await otherUserDocument.save();

    res.json(getApiResponse(otherUserDocument, false));
  } catch (err) {
    return next(err);
  }
});

const getApiResponse = (userDocument, following) => {
  return {
    profile: {
      username: userDocument.username,
      bio: userDocument.bio,
      image: userDocument.image,
      following,
    },
  };
};
