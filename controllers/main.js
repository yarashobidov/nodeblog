const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");

exports.homePage = (req, res) => {
  res.render("site/index");
};

exports.blogPage = async (req, res) => {
  const postPerPage = 4;
  const page = req.query.page || 1;

  await Post.find({})
    .lean()
    .skip(postPerPage * page - postPerPage)
    .limit(postPerPage)
    .populate({ path: "author", model: User })
    .sort({ $natural: -1 })
    .then((posts) => {
      Post.countDocuments().then((postCount) => {
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
          res.render("site/blog", {
            posts: posts,
            category: category,
            current: parseInt(page),
            pages: Math.ceil(postCount / postPerPage),
          });
        });
      });
    });
};

exports.contactPage = (req, res) => {
  res.render("site/contact");
};
