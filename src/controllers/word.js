const Word = require("../models/word");

const wordExist = async (condition) => {
  try {
    const userExist = await User.findOne(condition);
    return userExist;
  } catch (error) {
    return false;
  }
};
const createWord = async (request, res) => {
  try {
    const { name } = request.body;

    if (await wordExist({ name })) {
      return res.status(400);
    }

    const word = new Word({
      name,
    });

    await word.save();
    return res.status(200);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getAllWords = async (request, res) => {
  try {
    const list = await Word.find();
    return res.status(200).json({
      data: list || []
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getWordById = async (request, res) => {
  try {
    const id = request.params.id;
    const wordObject = await Word.findOne({ _id: id });

    if (!wordObject) {
      return res.status(200).json({
        data: undefined,
        message: "Word Does Not Exist",
      });
    }
    return res.status(200).json({
      data: wordObject,
      message: "Word Found",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
const updateWord = async (request, res) => {
  try {
    const { _id, name } = request.body;
    if (!(await wordExist({ _id }))) {
      return res.status(400).json({
        message: "Word Of Does not Exist",
      });
    }

    await User.updateOne({ _id }, { name });

    return res.status(200).json({
      data: _id,
      message: "Word Updated",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
const deleteWord = async (req, res) => {
  try {
    const { id } = req.params;
    await Word.deleteOne({ _id: id });
    return res.status(200);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
};
