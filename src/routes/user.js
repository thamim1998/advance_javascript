const express = require('express');
const bcrypt = require('bcrypt');

const Router = express.Router();
const userController = require("../controllers/user")
const authUtils = require("../utils/auth")
const {authenticate} = authUtils

Router.post("/",userController.createUser)
Router.get("/:id",authenticate,userController.getUserById)
Router.put("/",authenticate,userController.updateUser)
Router.get("/",authenticate,userController.getUsers)

module.exports = Router;