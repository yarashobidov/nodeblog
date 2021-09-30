const User = require("../models/User");

exports.getRegister = (req, res) => {
  res.render("site/register");
};
exports.postRegister = (req, res) => {
  User.create(req.body, (err, user) => {
    if (err || !user) console.log("Error: ", err);
    res.redirect("/users/login");
  });
};

exports.loginPage = (req, res) => {
  res.render("site/login");
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (user) {
      if (user.password === password) {
        req.session.userId = user._id;
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    } else {
      res.redirect("/users/register");
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
