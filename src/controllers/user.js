const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userExist = async (condition) => {
    try {
        const userExist = await User.findOne(condition);
        return userExist;
    } catch (error) {
        return false
    }
}
const createUser = async (request, response) => {
    try {
        const { email, email_cfg, password, password_cfg, username } = request.body;

        const hash = await bcrypt.hash(password, saltRounds);

        if (await userExist({ email })) {
            return response.status(400).json({
                "message": "User Of Same Email Exists",

            });
        }

        const user = new User({
            email,
            password: hash,
            username,
            active: true
        });

        await user.save();
        return response.status(200).json({
            "user": user,
            "message": "Users Created"

        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}

const getUsers = async (request, response) => {
    try {
        const userList = await User.find().select("-password");
        return response.status(200).json({
            "users": userList || [],
            "message": "Users Found"
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}

const getUserById = async (request, response) => {
    try {
        const id = request.params.id;
        const userObject = await User.findOne({ _id: id }).select("-password");

        if (!userObject) {
            return response.status(200).json({
                "userObject": undefined,
                "message": "User Does Not Exist"

            });
        }
        return response.status(200).json({
            "userObject": userObject,
            "message": "Users Created"

        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}
const updateUser = async (request, response) => {
    try {
        const { _id, email, username } = request.body;
        if (! await userExist({ _id })) {
            return response.status(400).json({
                "message": "User Of Does not Exist",

            });
        }

        await User.updateOne({ _id }, { email, username });

        return response.status(200).json({
            "data": _id,
            "message": "User Updated"

        });


    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
}
module.exports = {
    createUser,
    getUsers,
    updateUser,
    getUserById
}

