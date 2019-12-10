const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(403).json({
        error: "Email is taken!"
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({
        message: "Signup success! Please login."
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body
    //find user
    User.findOne({ email }, (err, user) => {
        //error check
        if (err || !user) {
            return res.status(401).json({
                error: "Email does not exist!"
            });
        }
        //authenticate
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match"
            });
        }
        //generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //persist token as 'cgt'
        res.cookie("cgt", token, { expire: new Date() + 999999 });
        //respond
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });
    })
};

exports.signout = (req, res) => {
    res.clearCookie("cgt")
    return res.json({
        message: "Signed out successfully"
    })
};

exports.requireSignin = expressJwt ({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})