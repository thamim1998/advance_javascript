const express = require('express');
const authUtils = require("../utils/auth")
const gameController = require("../controllers/game");
const { authenticate } = authUtils
const Router = express.Router();


Router.post('/', authenticate, gameController.createGame);
Router.get('/:id', authenticate, gameController.getGameById)
Router.get('/', authenticate, gameController.getAllGames)
Router.post('/verify', authenticate,gameController.verifyGame)

module.exports = Router;