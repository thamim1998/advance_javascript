require('dotenv').config()
const User = require("../models/user");
const jwt = require('jsonwebtoken');


const authenticate = async (req, res, next) => {
    try {
        const token = req.header("authorization");
        console.log(token);

        const decoded = jwt.verify(token, process.env.PUBLIC_KEY);
          const data = await User.findById(decoded.userId);
          req.user = data;
          console.log(req.user);
        req.token = token;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            status: "Error",
            message: "User not authorized",
        });
    }
}

const generateToken = async (userId, email) => {
    console.log(process.env.PUBLIC_KEY);
    const token = jwt.sign({ userId, email }, process.env.PUBLIC_KEY, { expiresIn: '10h' });

    return token;


}
const generateRefreshToken = async (userId, email) => {
    console.log(process.env.PUBLIC_KEY);
    const token = jwt.sign({ userId, email }, process.env.PUBLIC_KEY, { expiresIn: '20d' });

    return token;


}
module.exports = {
    generateToken,
    authenticate,
    generateRefreshToken
}
