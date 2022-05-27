const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.ObjectId,
    ref: "article",
    required: true,
    unique: true,
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  ],
});

module.exports = mongoose.model("favorite", favoriteSchema);
