const path = require("path");

const Category = require("../../models/Category");
const Post = require("../../models/Post");

exports.adminPage = (req, res) => {
  res.render("admin/index");
};

exports.categoriesPage = (req, res) => {
  Category.find({})
    .lean()
    .sort({ $natural: -1 })
    .then((categories) => {
      res.render("admin/categories", { categories: categories });
    });
};

exports.newCategory = (req, res) => {
  Category.create(req.body, (error, category) => {
    if (!error) {
      res.redirect("/admin/categories");
    }
  });
};

exports.deleteCategory = (req, res) => {
  Category.remove({ _id: req.params.id }).then(() => {
    res.redirect("/admin/categories");
  });
};

exports.postsPage = (req, res) => {
  Post.find({})
    .lean()
    .populate({ path: "category", model: Category })
    .sort({ $natural: -1 })
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
};

exports.editPostPage = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      Category.find({})
        .lean()
        .then((categories) => {
          res.render("site/editpost", { post: post, categories: categories });
        });
    });
};

exports.editPost = (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../../public/img/postimages", post_image.name)
  );
  Post.findOne({ _id: req.params.id }).then((post) => {
    post.title = req.body.title;
    post.content = req.body.content;
    post.date = req.body.date;
    post.category = req.body.category;
    post.post_image = `/img/postimages/${post_image.name}`;

    post.save().then((post) => {
      res.redirect("/admin/posts");
    });
  });
};

exports.deletePost = (req, res) => {
  Post.remove({ _id: req.params.id }).then(() => {
    res.redirect("/admin/posts");
  });
};
