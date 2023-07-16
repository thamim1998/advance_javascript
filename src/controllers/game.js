const Game = require("../models/game");
const Word = require("../models/word");
const Try = require("../models/try");

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

const getAllGames = async (request, resp) => {
    try {
        const gameList = await Game.find().populate("word tries");
        return resp.status(200).json({
            "data": gameList || [],
            "message": "Games Found"
        });
    } catch (error) {
        return resp.status(500).json({
            "error": error.message
        });
    }
}

const getGameById = async (request, resp) => {
    try {
        const id = request.params.id;
        const gameObject = await Game.findOne({ _id: id }).populate("word tries");

        if (!gameObject) {
            return resp.status(200).json({
                "data": undefined,
                "message": "Game Does Not Exist"

            });
        }
        return resp.status(200).json({
            "data": gameObject,
            "message": "Game Found"

        });

    } catch (error) {
        return resp.status(500).json({
            "error": error.message
        });
    }
}


const compareWords = (word, userWord) => {
    let response = '';

    for (let i = 0; i < word.length; i++) {
        if (word[i] === userWord[i]) {
            response += '1';
        } else if (word.includes(userWord[i])) {
            response += '0';
        } else {
            response += 'x';
        }
    }

    return response;
};


const verifyGame = async (req, resp) => {
    try {
        const { word, gameId } = req.body;
        const gameObject = await Game.findOne({ _id: gameId }).populate("word tries");
        if (typeof word === 'undefined') {
            return resp.status(500).json({
                "msg": "You have to send 'word' value"
            });
        }
        if (!gameObject) {
            return resp.status(200).json({
                "data": undefined,
                "message": "Game Does Not Exist"

            });
        }
        if (gameObject.word && gameObject.word.name) {
            let wordString = compareWords(gameObject.word.name, word)
            let tryAttempt = Try({
                word,
                result: wordString
            })
            tryAttempt = await tryAttempt.save()
            gameObject.tries = [...gameObject.tries, tryAttempt._id];
            await Game.updateOne({ _id: gameId }, { tries: gameObject.tries })
            console.log(gameObject.tries);
            return resp.status(200).json({
                "data": wordString,
                "message": "Here is your result"

            });
        }

        return resp.status(500).json({
            "result": "You don't find the word !"
        });


    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            "error": error.message
        });
    }
}

// ge the value searched by getting the game

// make the verification

// send the result
// const userWord = req.body.word;
// if (typeof userWord === 'undefined') {
//     return response.status(500).json({
//         "msg": "You have to send 'word' value"
//     });
// }




// return response.status(500).json({
//     "result": "You don't find the word !"
// });
module.exports = {
    createGame,
    getAllGames,
    getGameById,
    verifyGame
}
