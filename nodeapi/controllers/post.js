const Post = require('../models/post');
const formidable = require('formidable'); // module for parsing form data, especially file uploads.
const fs = require('fs');
const Series = require('../models/series');
const Cat = require('../models/cat');
const User = require('../models/user');
const _ = require('lodash'); // working with arrays, numbers, objects, strings, etc

exports.getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
            
            .skip((currentPage - 1) * perPage)
                .populate("postedBy", "_id name avatar")
                .populate("seriesOf", "name")
                .sort({ created: -1 })
                .limit(perPage)
                .select('_id title summary created thumbnail likes commentsCount')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
})}

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        Series.findById(post.seriesOf)
            .exec((err, series) => {
                if (err || !series) {
                    return res.status(400).json({
                        error: "Series not found"
                    });

                }
                post.seriesOf = series;
            });

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate("postedBy", "_id name avatar")
        .select('_id title created thumbnail')
        .sort("_created")
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(posts)
        })
};
 
exports.postsById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy", "_id name avatar created")
        .populate('comments.postedBy', '_id name avatar role')
        .populate("seriesOf", "name")
        .populate("catOf", "name")
        .select('_id title body created likes comments image thumbnail summary')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                })
            }
            req.post = post;
            next();
        })
};

exports.isPoster = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id
    let admin = req.post && req.auth && req.auth.role === "admin"
    let isPoster = sameUser || admin
    if (!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
};

exports.deletePost = (req, res) => {
    let post = req.post
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Post deleted successfully"
        })
    })
};

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};


exports.singlePost = (req, res) => {
    return res.json(req.post);
};

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push:
                { likes: req.body.userId }
        },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        {
            $pull:
                { likes: req.body.userId }
        },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
};

exports.addPointsForLikeOwner = (req, res, next) => {
    let likeNot = {}
    likeNot.user = req.body.userId
    likeNot.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$push: {points: 1, likeNot: likeNot}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.addPointsForLikeUser = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$push: {points: 1}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removeNotiForLike = (req, res, next) => {
    let likeNot = {}
    likeNot.user = req.body.userId
    likeNot.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$pull: {likeNot: likeNot}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePointsForLikeOwner = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$push: {points: -1}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePointsForLikeUser = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$push: {points: -1}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.addComment = (req, res, next) => {
    Post.findByIdAndUpdate(
        req.body.postId, 
        {$push: {commentsCount: 1}},
        (err, result) => {
            console.log(err)
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removeComment = (req, res, next) => {
    Post.findByIdAndUpdate(
        req.body.postId, 
        {$push: {commentsCount: -1}},
        (err, result) => {
            console.log(err)
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

    Post.findByIdAndUpdate(req.body.postId,
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

    Post.findByIdAndUpdate(req.body.postId,
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

exports.addPointsForCommentOwner = (req, res, next) => {
    let commentNot = {}
    commentNot.user = req.body.userId
    commentNot.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$push: {points: 2, commentNot: commentNot}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.addPointsForCommentUser = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$push: {points: 2}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removeNotiForComment = (req, res, next) => {
    let commentNot = {}
    commentNot.user = req.body.userId
    commentNot.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$pull: {commentNot: commentNot}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePointsForCommentOwner = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$push: {points: -2}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePointsForCommentUser = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        {$push: {points: -2}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.getPostsBySeries = (req, res, next, id) => {
    Post.find({ seriesOf: id })
        .select('_id title created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            req.posts = posts;
            next();
        })
};


exports.postsBySeries = (req, res) => {
    return res.json(req.posts);
};

exports.getPostsByCat = (req, res, next, id) => {
    Post.find({ catOf: id })
        .populate("postedBy", "_id name avatar")
        .populate("seriesOf", "name")
        .populate("catOf", "name")
        .sort({ created: -1 })
        .select('_id title summary created thumbnail likes')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            req.posts = posts;
            next();
        })
};

exports.postsByCat = (req, res) => {
    console.log(req.posts)
    return res.json(req.posts);
};

exports.listSearch = (req, res) => {
    const { search } = req.query;
    if (search) {
        Post.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            },
            (err, posts) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(posts);
            }
        ).select('-image -body -likes -comments -postedBy -seriesOf');
    }
};

exports.addPoints = (req, res, next) => {
    User.findByIdAndUpdate(
        req.profile._id, 
        {$push: {points: 5}},
        (err, result) => {
            console.log(err)
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removePoints = (req, res, next) => {
    User.findByIdAndUpdate(
        req.post.postedBy._id, 
        {$push: {points: -5}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}