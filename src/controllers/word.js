const Word = require('../models/word');

const wordExist = async (condition) => {
    try {
        const userExist = await User.findOne(condition);
        return userExist;
    } catch (error) {
        return false
    }
}
const createWord = async (request, response) => {
    try {
        const { name } = request.body;


        if (await wordExist({ name })) {
            return response.status(400).json({
                "message": "Word Of Same Name Exists",

            });
        }

        const word = new Word({
           name
        });

        await word.save();
        return response.status(200).json({
            "data": word,
            "message": "Word Created"

        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}

const getAllWords = async (request, response) => {
    try {
        const wordList = await Word.find();
        return response.status(200).json({
            "data": wordList || [],
            "message": "Words Found"
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}

const getWordById = async (request, response) => {
    try {
        const id = request.params.id;
        const wordObject = await Word.findOne({ _id: id });

        if (!wordObject) {
            return response.status(200).json({
                "data": undefined,
                "message": "Word Does Not Exist"

            });
        }
        return response.status(200).json({
            "data": wordObject,
            "message": "Word Found"

        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}
const updateWord = async (request, response) => {
    try {
        const { _id, name } = request.body;
        if (! await wordExist({ _id })) {
            return response.status(400).json({
                "message": "Word Of Does not Exist",

            });
        }

        await User.updateOne({ _id }, { name });

        return response.status(200).json({
            "data": _id,
            "message": "Word Updated"

        });


    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}
module.exports = {
    createWord,
    getAllWords,
    getWordById,
    updateWord
}

