const User = require("../models/user");
const FollowingModel = require("../models/following");
const FollowerModel = require("../models/follower");
const AppError = require("../utils/appError");

exports.follow = async (req, res, next) => {
  try {
    const id = new ObjectID(req.params.id);

    // check if the id is a valid one
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).json({ error: "Invalid ID" });
    }

    // check if your id doesn't match the id of the user you want to follow
    if (res.user._id === req.params.id) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // add the id of the user you want to follow in following array
    const query = {
      _id: res.user._id,
      following: { $not: { $elemMatch: { $eq: id } } },
    };

    const update = {
      $addToSet: { following: id },
    };

    const updated = await User.updateOne(query, update);

    // add your id to the followers array of the user you want to follow
    const secondQuery = {
      _id: id,
      followers: { $not: { $elemMatch: { $eq: res.user._id } } },
    };

    const secondUpdate = {
      $addToSet: { followers: res.user._id },
    };

    const secondUpdated = await User.updateOne(secondQuery, secondUpdate);

    if (!updated || !secondUpdated) {
      return res.status(404).json({ error: "Unable to follow that user" });
    }

    res.status(200).json(update);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    let whomUnFollowed = await User.findByIdAndUpdate(
      { _id: req.body.followingId },
      { $pull: { following: req.body.followerId } }
    );
    let whoUnFollowedMe = await User.findByIdAndUpdate(
      { _id: req.body.followerId },
      { $pull: { followers: req.body.followingId } }
    );
    return res.status(200).send({ message: "User UnFollow Success" });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "User UnFollow Failed", data: e.message });
  }
};
