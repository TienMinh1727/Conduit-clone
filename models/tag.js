const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("tag", tagSchema);
