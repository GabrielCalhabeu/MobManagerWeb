const express = require("express");
const routes = express.Router();

const accountController = require("./controllers/accountController");
const fileController = require("./controllers/fileController");
const accounts = require("./models/accounts");
const files = require("./models/file");
//Rota account
routes.post("/accounts", accountController.create);
routes.post("/accounts/auth", accountController.auth);
routes.delete("/accounts/:id", accountController.delete);

routes.post("/files", fileController.create);
routes.get("/files", fileController.read);
routes.delete("/files/del", fileController.delete);
routes.post("/files/:id", fileController.update);

module.exports = routes;
