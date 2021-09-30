const express = require("express");
const { homePage, blogPage, contactPage } = require("../controllers/main");
const router = express.Router();

router.get("/", homePage);

router.get("/blog/", blogPage);

router.get("/contact", contactPage);

module.exports = router;
