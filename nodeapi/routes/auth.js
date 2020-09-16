const express = require('express');
const { signup, signin, signout, forgotPassword, resetPassword, socialLogin, preSignup } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { userSignupValidator, passwordResetValidator } = require("../validator");

const router = express.Router();

router.post('/pre-signup', userSignupValidator, preSignup);
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

router.param("userId", userById);

router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/social-login", socialLogin);

module.exports = router;
