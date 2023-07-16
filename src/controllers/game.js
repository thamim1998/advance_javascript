const Game = require("../models/game");
const Word = require("../models/word");

const createGame = async (req, resp) => {
    try {
        const word = await Word.aggregate([{
            $sample: { size: 1 }
        }]);

        let game = new Game({
            word: word[0]._id,
            tries: [],
            user: req.user._id
        });

        await game.save();
        game = await Game.findOne({
            _id: game._id
        }).populate('user').populate('word')

        return resp.status(200).json({
            "msg": game
        });

    } catch (error) {
        return resp.status(500).json({
            "error": error.message
        });
    }
}

const getAllGames = async (request, response) => {
    try {
        const gameList = await Game.find();
        return response.status(200).json({
            "data": gameList || [],
            "message": "Games Found"
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}

const getGameById = async (request, response) => {
    try {
        const id = request.params.id;
        const gameObject = await Game.findOne({ _id: id });

        if (!gameObject) {
            return response.status(200).json({
                "data": undefined,
                "message": "Game Does Not Exist"

            });
        }
        return response.status(200).json({
            "data": gameObject,
            "message": "Game Found"

        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}
module.exports = {
    createGame,
    getAllGames,
    getGameById
}
