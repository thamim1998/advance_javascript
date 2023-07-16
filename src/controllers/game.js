const Game = require("../models/game");
const Word = require("../models/word");
const Try = require("../models/try");

const createGame = async (req, res) => {
  try {
    const word = await Word.aggregate([
      {
        $sample: { size: 1 },
      },
    ]);

    let game = new Game({
      word: word[0]._id,
      tries: [],
      user: req.user._id,
    });

    await game.save();
    game = await Game.findOne({
      _id: game._id,
    })
      .populate("user")
      .populate("word");

    return res.status(200).json({
      msg: game,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getAllGames = async (request, res) => {
  try {
    const gameList = await Game.find().populate("word tries");
    return res.status(200).json({
      data: gameList || [],
      message: "Game is succesfully found",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getGameById = async (request, res) => {
  try {
    const id = request.params.id;
    const gameData = await Game.findOne({ _id: id }).populate("word tries");

    if (!gameData) {
      return res.status(200).json({
        data: undefined,
        message: "Match doesnt found",
      });
    }
    return res.status(200).json({
      data: gameData,
      message: "A game match successfully found",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const matchWords = (word, userWord) => {
  let resonse = "";

  for (let i = 0; i < word.length; i++) {
    if (word[i] === userWord[i]) {
      resonse += "1";
    } else if (word.includes(userWord[i])) {
      resonse += "0";
    } else {
      resonse += "x";
    }
  }

  return resonse;
};

const matchGame = async (req, res) => {
  try {
    const { word, gameId } = req.body;
    const gameData = await Game.findOne({ _id: gameId }).populate("word tries");
    if (typeof word === "undefined") {
      return res.status(500)
    }
    if (!gameData) {
      return res.status(200)
    }
    if (gameData.word && gameData.word.name) {
      let dataString = matchWords(gameData.word.name, word);
      let tryAttempt = Try({
        word,
        result: dataString,
      });
      tryAttempt = await tryAttempt.save();
      gameData.tries = [...gameData.tries, tryAttempt._id];
      await Game.updateOne({ _id: gameId }, { tries: gameData.tries });
      console.log(gameData.tries);
      return res.status(200)
    }

    return res.status(500).json({
      result: "You are unable to find the word",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  matchGame,
};
