const _ = require('lodash');
const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate('following', '_id name avatar')
        .populate('followers', '_id name avatar')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                });

            }
            req.profile = user;
            next();
        })
};

exports.userNotification = (req, res) => {
    User.findById(req.profile._id)
        .populate('likeNot.user', 'name')
        .populate('likeNot.post', '_id title')
        .populate('commentNot.user', 'name')
        .populate('commentNot.post', '_id title')
        .select("likeNot commentNot")
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                });

            }
            res.json(
                user
            );
        })
};

exports.hasAuthorization = (req, res, next) => {
    const sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    const admin = req.profile && req.auth && req.auth.role === "admin";
    const authorized = sameUser || admin
    
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action!"
        });
    }
    next()
};

exports.clearCommNot = (req, res) => {
    let data = {}
    data.user = req.body.userId
    data.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$pull: {commentNot: data}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            res.json(result)
        }
    )
};

exports.clearLikeNot = (req, res, next) => {
    let data = {}
    data.user = req.body.userId
    data.post = req.body.postId
    User.findByIdAndUpdate(
        req.body.ownerId,
        {$pull: {likeNot: data}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            res.json(result)
        }
    )
};

// exports.allUsers = (req, res) => {
//     User.find((err, users) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(
//             users
//         );
//     }).select("name role updated created avatar Sinstagram Sfacebook Stwitter Syoutube");
// };

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save((err) => {
        if (err) {
            return res.status(400).json({
                error: "Unauthorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({
            user
        });
    })
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({
            user
        });
    });
};

exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId, 
        {$push: {following: req.body.followId, points: 5}},
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId, 
        {$push: {followers: req.body.userId, points: 5}}, 
        {new: true},
    )
    .populate('following', '_id name avatar')
    .populate('followers', '_id name avatar')
    .exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    })
}

exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId, 
        {$pull: {following: req.body.unfollowId, points: 5}}, 
        (err, result) => {
            if(err) {
                return res.status(400).json({error: err});
            }
            next();
        }
    )
}

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId, 
        {$pull: {followers: req.body.userId, points: 5}}, 
        {new: true}
    )
    .populate('following', '_id name avatar')
    .populate('followers', '_id name avatar')
    .exec((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    })
};

exports.findPeople = (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    User.find({_id: {$nin: following}}, (err, users) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users)
    }).select("_id name avatar")
}

exports.userSearch = (req, res) => {
    const { search } = req.query;
    if (search) {
        User.find(
            {
                $or: [{ name: { $regex: search, $options: 'i' } }, { fullname: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
            },
            (err, users) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(users);
            }
        ).select('-hashed_password -salt -cover -about -following -followers -resetPasswordLink -role -points');
    }
};

exports.bloodSearch = (req, res) => {
    const { search } = req.query;
    if (search) {
        User.find(
            {
                $or: [{ blood: { $regex: search, $options: 'i' } }]
            },
            (err, users) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(users);
            }
        ).select('-hashed_password -salt -cover -about -following -followers -resetPasswordLink -role -points -likeNot -commentNot');
    }
};