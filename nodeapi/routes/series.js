const express = require('express');
const { getSeries, 
        createSeries, 
        seriesByUser, 
        seriesById, 
        isCreator, 
        deleteSeries, 
        updateSeries, 
        singleSeries,
        addPoints,
        removePoints
        } = require('../controllers/series');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/series', getSeries);
router.get('/series/:seriesId', singleSeries);

router.post('/series/new/:userId', requireSignin, addPoints, createSeries);

router.get('/series/by/:userId', requireSignin, seriesByUser);

router.delete('/series/:seriesId', requireSignin, isCreator, removePoints, deleteSeries);
router.put('/series/:seriesId', requireSignin, isCreator, updateSeries);

router.param("userId", userById);
router.param("seriesId", seriesById);

module.exports = router;
