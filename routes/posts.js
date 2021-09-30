const express = require("express");
const router = express.Router();
const {
  addPostPage,
  search,
  categoryID,
  getPostId,
  newPost,
} = require("../controllers/posts");

router.get("/new", addPostPage);

router.get("/search", search);

router.get("/category/:categoryId", categoryID);

router.get("/:id", getPostId);

router.post("/test", newPost);

module.exports = router;
