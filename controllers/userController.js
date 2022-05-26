const UserModel = require("../models/user");
const ApiError = require("../models/apiError");
const authController = require("./authController");
const validations = require("../utils/validations");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      data: user,
    },
  });
};

const register = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) return next(new ApiError("Please provide username"));
  if (!email) return next(new ApiError("Please provide email"));
  if (!validations.emailRegex.test(email))
    return next(new ApiError("Email address not valid"));
  if (!password) return next(new ApiError("Please provide password"));

  UserModel.findOne({ username })
    .then((document) => {
      if (document !== null) {
        return Promise.reject(new ApiError("Username already exists"));
      }
      return UserModel.findOne({ email });
    })
    .then((document) => {
      if (document !== null) {
        return Promise.reject(new ApiError("Email already exists"));
      }
      return UserModel.create(req.body);
    })
    .then((document) => {
      authController.generateToken(document, (err, token) => {
        if (err) return Promise.reject(err);
        res.json(getApiResponse(document, token));
      });
    })
    .catch((err) => next(err));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  // 2) Check if user exists and password is correct
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user.userId)
    .then((document) => {
      if (document === null)
        return Promise.reject(new ApiError("User not found"));
      res.json(getApiResponse(document, req.token));
    })
    .catch((err) => next(err));
};

const updateCurrentUser = async (req, res, next) => {
  const { email, username, bio, image } = req.body.user;

  let updateObject = {};

  if (email) updateObject["email"] = email;
  if (username) updateObject["username"] = username;
  if (bio) updateObject["bio"] = bio;
  if (image) updateObject["image"] = image;
  if (Object.keys(updateObject).length === 0)
    return next(new ApiError("At least one field is required"));

  if (email) {
    if (!validations.emailRegex.test(email))
      return next(new ApiError("Invalid email format"));
    const document = await UserModel.findOne({ email });
    if (document) return next(new ApiError("Email already in use"));
  }

  if (username) {
    const document = await UserModel.findOne({ username });
    if (document) return next(new ApiError("Username already in use"));
  }

  UserModel.findByIdAndUpdate(req.user.userId, updateObject, { new: true })
    .then((document) => {
      res.json(getApiResponse(document, req.token));
    })
    .catch((err) => next(err));
};

const getApiResponse = (userDocument, token) => {
  return {
    user: {
      email: userDocument.email,
      token,
      username: userDocument.username,
      bio: userDocument.bio,
      image: userDocument.image,
    },
  };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
};
