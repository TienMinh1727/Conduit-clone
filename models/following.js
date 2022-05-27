const mongoose = require("mongoose");

const followingSchema = new mongoose.Schema({
  followings: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  ],
});

module.exports = mongoose.model("following", followingSchema);
