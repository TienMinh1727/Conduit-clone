const ArticleModel = require("../models/article");
const factory = require("../controllers/handlerFactory");

exports.getAllArticles = factory.getAll(ArticleModel);
exports.add = factory.createOne(ArticleModel);
exports.getOne = factory.getOne(ArticleModel);
exports.update = factory.updateOne(ArticleModel);
exports.remove = factory.deleteOne(ArticleModel);
