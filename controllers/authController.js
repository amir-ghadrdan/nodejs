const { JWT_SECRET } = require("../config/config");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username })
    if (user) {
        return res.status(400).json({
            status: "user already exists",
        })
    }
    const hashpassword = await bcrypt.hash(password, 12)
    try {
        const newUser = await User.create({
            username,
            password: hashpassword
        })
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
        })
    }
}


exports.login = async (req, res) => {
    console.log("yess")
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "user with this username not signin up"
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password)
        if (isCorrect) {

            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '10h' });
            req.session.jwt = token;

            res.status(200).json({
                status: "success",
                data: {
                    user: user
                }
            })
        } else {
            return res.status(400).json({
                status: "fail",
                message: "incorecct password or username"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail",
        })
    }
}
