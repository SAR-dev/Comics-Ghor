const Series = require('../models/series');
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getSeries = (req, res) => {
    const series = Series.find()
        .populate("createdBy", "_id name avatar")
        .select('_id name image shortSummary created createdBy')
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
    let sameUser = req.series && req.auth && req.series.createdBy._id == req.auth._id
    let admin = req.post && req.auth && req.auth.role === "admin"
    let isCreator = sameUser || admin
    
    if(!isCreator) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
}

exports.seriesById = (req, res, next, id) => {
    Series.findById(id)
        .populate("createdBy", "_id name avatar")
        .select('_id name image summary created createdBy')
        .exec((err, series) => {
            if (err || !series) {
                return res.status(400).json({
                    error: err
                })
            }
            req.series = series;
            next();
        })
};

exports.singleSeries = (req, res) => {
    return res.json(req.series);
};

exports.deleteSeries = (req, res) => {
    console.log(req.profile)
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
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save series
        let series = req.series;
        series = _.extend(series, fields);
        series.updated = Date.now();

        if (files.photo) {
            series.photo.data = fs.readFileSync(files.photo.path);
            series.photo.contentType = files.photo.type;
        }

        series.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(series);
        });
    });
};

exports.addPoints = (req, res, next) => {
    User.findByIdAndUpdate(
        req.profile._id, 
        {$push: {points: 15}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePoints = (req, res, next) => {
    User.findByIdAndUpdate(
        req.series.createdBy._id, 
        {$push: {points: -25}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.comment = (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId

    Series.findByIdAndUpdate(req.body.seriesId,
        {
            $push:
                { comments: comment }
        },
        { new: true }
    )
    .populate('comments.postedBy', '_id name avatar')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment

    Series.findByIdAndUpdate(req.body.seriesId,
        {
            $pull:
                { comments: {_id: comment._id} }
        },
        { new: true }
    )
    .populate('comments.postedBy', '_id name avatar')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
};