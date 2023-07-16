const express = require('express');
const WordModel = require('../models/word');
const GameModel = require("../models/game");
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

Router.post('/verify', authenticate, (request, response) => {
    // get the value from the user

    // ge the value searched by getting the game

    // make the verification

    // send the result
    const userWord = req.body.word;
    if (typeof userWord === 'undefined') {
        return response.status(500).json({
            "msg": "You have to send 'word' value"
        });
    }




    return response.status(500).json({
        "result": "You don't find the word !"
    });
})

module.exports = Router;