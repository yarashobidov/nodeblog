const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { generateDate, limit, truncate, paginate } = require("./helpers/hbs");
var session = require("express-session");
const MongoStore = require("connect-mongo");
var methodOverride = require("method-override");
const dotenv = require("dotenv");
dotenv.config();

const main = require("./routes/main.js");
const posts = require("./routes/posts.js");
const users = require("./routes/users.js");
const admin = require("./routes/admin/index");

const app = express();


mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("DB Connected")
);

app.use(fileUpload());
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

const hbs = exphbs.create({
  helpers: {
    generateDate: generateDate,
    limit: limit,
    truncate: truncate,
    paginate: paginate,
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// display Link Middleware

app.use((req, res, next) => {
  const { userId, admin } = req.session;
  if (userId) {
    res.locals = {
      displayLink: true,
    };
  } else {
    res.locals = {
      displayLink: false,
    };
  }
  next();
});

app.use("/", main);
app.use("/posts", posts);
app.use("/users", users);
app.use("/admin", admin);

const POST = process.env.PORT || 5000;
const hostname = process.env.hostname || "127.0.0.2";

app.listen(POST, hostname, () =>
  console.log(`Server ishga tushdi http://${hostname}:${POST}`)
);
