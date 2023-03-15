const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: String,
  password: String,
});

module.exports = mongoose.model("account", accountSchema);
