const factory = require("../controllers/handlerFactory");
const CommentModel = require("../models/comment");

exports.add = factory.createOne(CommentModel);
exports.getMany = factory.getAll(CommentModel);
exports.remove = factory.deleteOne(CommentModel);
exports.update = factory.updateOne(CommentModel);
