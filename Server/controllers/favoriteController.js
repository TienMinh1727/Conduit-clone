const Article = require('../models/article');
const catchAsync = require('./../utils/catchAsync');

exports.add = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article.favorites.includes(userId)) {
      await article.updateOne({ $push: { favorites: userId } });
      res.status(200).json({
        success: true,
        message: 'The article has been liked !',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

exports.remove = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const article = await Article.findOne({ slug: req.params.slug });
    await article.updateOne({
      $pull: { favorites: userId },
    });
    res.status(200).json({
      success: true,
      message: 'The article has been disliked !',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
