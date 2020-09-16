const Cat = require('../models/cat');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getCat = (req, res) => {
    const cat = Cat.find()
        .select('_id name image summary')
        .then((cat) => {
            res.json({ cat })
        })
        .catch(err => console.log(err))
};

exports.createCat = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        let cat = new Cat(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;

        if(files.photo) {
            cat.photo.data = fs.readFileSync(files.photo.path)
            cat.photo.contentType = files.photo.type
        }
        
        cat.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(result)
        })
    })
};

exports.isAdmin = (req, res, next) => {
    let admin = req.auth && req.auth.role === "admin"
    if(!admin) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
}

exports.catById = (req, res, next, id) => {
    Cat.findById(id)
        .select('_id name image summary')
        .exec((err, cat) => {
            if (err || !cat) {
                return res.status(400).json({
                    error: err
                })
            }
            req.cat = cat;
            next();
        })
};

exports.singleCat = (req, res) => {
    return res.json(req.cat);
};

exports.deleteCat = (req, res) => {
    let cat = req.cat
    cat.remove((err, cat) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Cat deleted successfully"
        })
    })
};

exports.updateCat = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save cat
        let cat = req.cat;
        cat = _.extend(cat, fields);
        cat.updated = Date.now();

        if (files.photo) {
            cat.photo.data = fs.readFileSync(files.photo.path);
            cat.photo.contentType = files.photo.type;
        }

        cat.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(cat);
        });
    });
};
