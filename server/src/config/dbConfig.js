const mongoose = require("mongoose");

const dbConfig =
  "mongodb+srv://gabriel:Crossfire001@cluster0.gsgyylo.mongodb.net/mobmanager?retryWrites=true&w=majority";

const connection = mongoose.connect(dbConfig, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
