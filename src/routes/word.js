const express = require('express');
const Router = express.Router();

const authUtils = require("../utils/auth")
const wordController = require("../controllers/word")
const { authenticate } = authUtils
// Router.post('/',authenticate, async (request, response) => {
//     const { word } = request.body;

//     const wordModel = new WordModel({ 
//         name: word
//     });

//     try {

//         await wordModel.save();

//         return response.status(200).json({
//             "msg": word
//         });

//     } catch (error) {
//         return response.status(500).json({
//             "error": error.message
//         });
//     }
// });
Router.post("/", authenticate, wordController.createWord);
Router.put("/", authenticate, wordController.updateWord);
Router.get("/:id", authenticate, wordController.getWordById);
Router.get("/", authenticate, wordController.getAllWords);
module.exports = Router;