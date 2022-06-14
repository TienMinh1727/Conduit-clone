const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
  ],
});

module.exports = mongoose.model('favorite', favoriteSchema);
