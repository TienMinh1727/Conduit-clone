const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: { type: String, lowercase: true, unique: true },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    favorites: {
      type: Array,
      default: [],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
    tagList: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  },
  {
    timestamps: true,
  }
);

articleSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

articleSchema.methods.updateFavoriteCount = function () {
  let article = this;

  return User.count({ favorites: { $in: [article._id] } }).then(function (
    count
  ) {
    article.favoritesCount = count;

    return article.save();
  });
};

articleSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user),
  };
};

module.exports = mongoose.model('article', articleSchema);
