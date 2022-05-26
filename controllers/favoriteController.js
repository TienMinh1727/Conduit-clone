const factory = require("../controllers/handlerFactory");
const FavoriteModel = require("../models/favorite");

const add = factory.createOne(FavoriteModel);
const remove = factory.deleteOne(FavoriteModel);

module.exports = {
  add,
  remove,
};
