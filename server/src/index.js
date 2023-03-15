const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routes");
require("./config/dbConfig");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(routes);
app.listen(3333);
