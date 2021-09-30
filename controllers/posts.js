const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const path = require("path");

exports.addPostPage = (req, res) => {
  if (!req.session.userId) {
    res.redirect("/users/login");
  }
  Category.find({})
    .lean()
    .then((categories) => {
      res.render("site/addpost", { categories: categories });
    });
};

exports.search = (req, res) => {
  if (req.query.look) {
    const regex = new RegExp(escapeRegex(req.query.look), "gi");
    Post.find({ title: regex })
      .lean()
      .populate({ path: "author", model: User })
      .sort({ $natural: -1 })
      .then((posts) => {
        Category.aggregate([
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "category",
              as: "posts",
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              num_of_posts: { $size: "$posts" },
            },
          },
        ]).then((category) => {
          res.render("site/blog", { posts: posts, category: category });
        });
      });
  }
};

exports.categoryID = (req, res) => {
  Post.find({ category: req.params.categoryId })
    .lean()
    .populate({
      path: "category",
      model: Category,
    })
    .populate({ path: "author", model: User })
    .then((posts) => {
      Category.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "category",
            as: "posts",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            num_of_posts: { $size: "$posts" },
          },
        },
      ]).then((category) => {
        res.render("site/blog", { posts: posts, category: category });
      });
    });
};

exports.getPostId = (req, res) => {
  Post.findById(req.params.id)
    .lean()
    .populate({ path: "author", model: User })
    .sort({ $natural: -1 })
    .then((post) => {
      Post.find({})
        .lean()
        .populate({ path: "author", model: User })
        .sort({ $natural: -1 })
        .then((posts) => {
          Category.aggregate([
            {
              $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "category",
                as: "posts",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                num_of_posts: { $size: "$posts" },
              },
            },
          ]).then((category) => {
            res.render("site/post", {
              post: post,
              posts: posts,
              category: category,
            });
          });
        });
    });
};

exports.newPost = (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );
  Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
    author: req.session.userId,
  });
  res.redirect("/blog");
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
