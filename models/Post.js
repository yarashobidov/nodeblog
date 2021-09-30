const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  content: { type: String, required: true },
  post_image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
