const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  ],
});

module.exports = mongoose.model("follower", followerSchema);
