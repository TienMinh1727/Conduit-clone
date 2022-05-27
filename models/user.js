const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validations = require("../utils/validations");

const saltRounds = 10;

const userSchema = new mongoose.Schema({
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
    minlength: [8, "Password must be at least 8 characters long"],
  },
  bio: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", function (next) {
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

userSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    admin: this.admin,
    following: user ? user.checkStatus(this._id, "following") : false,
  };
};

userSchema.method({
  // The type can be favorites or following
  performAction: function (id, type) {
    if (this[type].indexOf(id) === -1) {
      this[type].push(id);
    }
    return this.save();
  },
  // Unfavorite an article or unfollow a user
  undoAction: function (id, type) {
    this[type].remove(id);
    return this.save();
  },
  // Check status of following or favorited
  checkStatus: function (id, type) {
    return this[type].some(function (favoriteId) {
      return favoriteId.toString() === id.toString();
    });
  },
});
module.exports = mongoose.model("user", userSchema);
