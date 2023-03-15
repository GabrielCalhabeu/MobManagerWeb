const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  user: String,
  title: String,
  file: Array,
});

module.exports = mongoose.model("savefiles", fileSchema);
