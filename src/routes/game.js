const express = require('express');
const authUtils = require("../utils/auth")
const gameController = require("../controllers/game");
const { authenticate } = authUtils
const Router = express.Router();

const isLogged = (request, response, next) => {
    if (request.session.user) {
        console.log('test');
        next();
    } else {
        return response.status(500).json({ 'msg': "not logged !" })
    }
}

Router.post('/', authenticate, gameController.createGame);

Router.get('/:id', authenticate, gameController.getGameById)
Router.get('/', authenticate, gameController.getAllGames)

Router.post('/verify', authenticate,gameController.verifyGame)

module.exports = Router;