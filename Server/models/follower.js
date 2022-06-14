const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
  ],
});

module.exports = mongoose.model('follower', followerSchema);
