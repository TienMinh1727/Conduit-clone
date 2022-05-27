const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    article: {
      type: mongoose.Schema.ObjectId,
      ref: "article",
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
