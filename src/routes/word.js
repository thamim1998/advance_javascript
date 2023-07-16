const express = require('express');
const Router = express.Router();

const authToken = require("../token/auth")
const wordController = require("../controllers/word")
const { authenticate } = authToken

Router.post("/", authenticate, wordController.createWord);
Router.put("/", authenticate, wordController.updateWord);
Router.get("/:id", authenticate, wordController.getWordById);
Router.get("/", authenticate, wordController.getAllWords);
Router.delete("/:id", authenticate, wordController.deleteWord);
module.exports = Router;