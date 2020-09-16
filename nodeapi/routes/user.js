const express = require('express');
const { 
    userById, 
    allUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    addFollowing,
    addFollower ,
    removeFollowing,
    removeFollower,
    findPeople,
    hasAuthorization,
    userSearch,
    bloodSearch,
    userNotification,
    clearCommNot,
    clearLikeNot
    } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.get('/user/search', userSearch);
router.get('/user/blood/search', bloodSearch);

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);
// router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);
router.get('/user/findpeople/:userId', requireSignin, findPeople);

router.get('/user/notification/:userId', requireSignin, userNotification);

router.put('/user/like/clear/:userId', requireSignin, hasAuthorization, clearLikeNot);
router.put('/user/comment/clear/:userId', requireSignin, hasAuthorization, clearCommNot);

router.param("userId", userById);

module.exports = router;
