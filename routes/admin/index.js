const express = require("express");
const router = express.Router();
const {
  deleteCategory,
  categoriesPage,
  adminPage,
  newCategory,
  postsPage,
  editPostPage,
  editPost,
  deletePost,
} = require("../../controllers/admin/index");

router.get("/", adminPage);

router.get("/categories", categoriesPage);

router.post("/categories", newCategory);

router.delete("/categories/:id", deleteCategory);

router.get("/posts", postsPage);

router.get("/posts/edit/:id", editPostPage);

router.put("/posts/edit/:id", editPost);

router.delete("/posts/:id", deletePost);

module.exports = router;
