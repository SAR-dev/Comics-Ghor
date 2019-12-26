const express = require('express');
const { getPosts, 
        createPost, 
        postsByUser, 
        postsById, 
        isPoster, 
        deletePost, 
        updatePost, 
        singlePost, 
        like, 
        unlike, 
        comment, 
        uncomment,
        postsBySeries,
        getPostsBySeries
        } = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.get('/posts', getPosts);
router.get('/posts/series/:seriesPostsId', postsBySeries);

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/post/:postId', singlePost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);

router.param("userId", userById);
router.param("postId", postsById);
router.param("seriesPostsId", getPostsBySeries);

module.exports = router;