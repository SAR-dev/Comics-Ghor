const express = require('express');
const { getCat,
        createCat,
        catById,
        isAdmin,
        deleteCat,
        updateCat,
        singleCat
        } = require('../controllers/cat');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/cat', getCat);
router.get('/cat/:catId', singleCat);
router.delete('/cat/:catId', requireSignin, isAdmin, deleteCat);
router.put('/cat/:catId', requireSignin, isAdmin, updateCat);

router.post('/cat/new/:userId', requireSignin, isAdmin, createCat);

router.param("catId", catById);
router.param("userId", userById);

module.exports = router;
