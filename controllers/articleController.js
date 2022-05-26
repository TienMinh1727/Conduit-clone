const ArticleModel = require("../models/article");
const factory = require("../controllers/handlerFactory");

const add = factory.createOne(ArticleModel);
const getOne = factory.getOne(ArticleModel);
const getAllArticles = factory.getAll(ArticleModel);
const update = factory.updateOne(ArticleModel);
const remove = factory.deleteOne(ArticleModel);

module.exports = {
  add,
  getOne,
  getAllArticles,
  update,
  remove,
};
