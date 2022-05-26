const factory = require("../controllers/handlerFactory");
const CommentModel = require("../models/comment");

const add = factory.createOne(CommentModel);
const getMany = factory.getAll(CommentModel);
const remove = factory.deleteOne(CommentModel);
const update = factory.updateOne(CommentModel);

module.exports = {
  add,
  update,
  getMany,
  remove,
};
