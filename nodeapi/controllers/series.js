const Series = require('../models/series');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getSeries = (req, res) => {
    const series = Series.find()
        .select('_id name image createdBy')
        .then((series) => {
            res.json({ series })
        })
        .catch(err => console.log(err))
};

exports.createSeries = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        let series = new Series(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        series.createdBy = req.profile;

        if(files.photo) {
            series.photo.data = fs.readFileSync(files.photo.path)
            series.photo.contentType = files.photo.type
        }
        
        series.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
};

exports.seriesByUser = (req, res) => {
    Series.find({createdBy: req.profile._id})
        .populate("createdBy", "_id name image")
        .sort("_created")
        .exec((err, series) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(series)
        })
};

exports.isCreator = (req, res, next) => {
    let isCreator = req.series && req.auth && req.series.createdBy._id == req.auth._id
    if(!isCreator) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
}

exports.seriesById = (req, res, next, id) => {
    Series.findById(id)
        .populate("createdBy", "_id name image")
        .exec((err, series) => {
            if(err || !series) {
                return res.status(400).json({
                    error: err
                })
            }
            req.series = series;
            next();
        })
};

exports.deleteSeries = (req, res) => {
    let series = req.series
    series.remove((err, series) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Series deleted successfully"
        })
    })
};

exports.updateSeries = (req, res, next) => {
    let series = req.series;
    series = _.extend(series, req.body);
    series.updated = Date.now();
    series.save((err) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(series);
    })
};

