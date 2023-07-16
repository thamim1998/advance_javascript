const express = require('express');
const authToken = require("../token/auth")
const gameController = require("../controllers/game");
const { authenticate } = authToken
const Router = express.Router();


Router.post('/', authenticate, gameController.createGame);
Router.get('/:id', authenticate, gameController.getGameById)
Router.get('/', authenticate, gameController.getAllGames)
Router.post('/verify', authenticate,gameController.matchGame)

module.exports = Router;