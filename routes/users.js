const express = require("express");
const router = express.Router();
const {
  login,
  getRegister,
  postRegister,
  loginPage,
  logout,
} = require("../controllers/users");

router.get("/register", getRegister);

router.post("/register", postRegister);

router.get("/login", loginPage);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
