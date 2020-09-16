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
        getPostsBySeries,
        postsByCat,
        getPostsByCat,
        listSearch,
        addPoints,
        removePoints,
        addComment,
        removeComment,
        addPointsForLikeOwner,
        addPointsForLikeUser,
        removeNotiForLike,
        removePointsForLikeOwner,
        removePointsForLikeUser,
        addPointsForCommentOwner,
        addPointsForCommentUser,
        removeNotiForComment,
        removePointsForCommentOwner,
        removePointsForCommentUser
        } = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.put('/post/like', requireSignin, addPointsForLikeOwner, addPointsForLikeUser, like);
router.put('/post/unlike', requireSignin, removeNotiForLike, removePointsForLikeOwner, removePointsForLikeUser, unlike);

router.put('/post/comment', requireSignin, addPointsForCommentOwner, addPointsForCommentUser, addComment, comment);
router.put('/post/uncomment', requireSignin, removeNotiForComment, removePointsForCommentOwner, removePointsForCommentUser, removeComment, uncomment);

router.get('/posts', getPosts);
router.get('/posts/search', listSearch);

router.get('/posts/series/:seriesPostsId', postsBySeries);
router.get('/posts/cat/:catId', postsByCat);

router.post('/post/new/:userId', requireSignin, addPoints, createPost, createPostValidator);
router.get('/post/:postId', singlePost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.delete('/post/:postId', requireSignin, isPoster, removePoints, deletePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);

router.param("userId", userById);
router.param("postId", postsById);
router.param("seriesPostsId", getPostsBySeries);
router.param("catId", getPostsByCat);

module.exports = router;
