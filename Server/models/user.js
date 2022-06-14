const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validations = require('../utils/validations');

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: validations.emailRegex,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
      },
    ],
    favorites: [{ type: mongoose.Schema.ObjectId, ref: 'article' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ slug: 1 });

userSchema.pre('save', function (next) {
  bcrypt
    .hash(this.password, saltRounds)
    .then((hashed) => {
      this.password = hashed;
      next();
    })
    .catch((err) => next(err));
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('user', userSchema);
