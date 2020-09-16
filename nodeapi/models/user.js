const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fullname: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
    avatar: {
        type: String,
        default: 'lJR3DFp'
    },
    cover: {
        type: String,
        default: 'kWQrZq9'
    },
    about: {
        type: String,
        trim: true
    },
    Sinstagram: {
        type: String
    },
    Sfacebook: {
        type: String
    },
    Stwitter: {
        type: String
    },
    Syoutube: {
        type: String
    },
    blood: {
        type: String
    },
    contact: {
        type: String
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    following: [{type: ObjectId, ref: "User"}],
    followers: [{type: ObjectId, ref: "User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    },
    points: {
        type: Array,
        default: []
        
    },
    commentNot: [
        {
            user: {type: ObjectId, ref: "User"},
            post: {type: ObjectId, ref: "Post"},
            created: {type: Date, default: Date.now},
        }
    ],
    likeNot: [
        {
            user: {type: ObjectId, ref: "User"},
            post: {type: ObjectId, ref: "Post"},
            created: {type: Date, default: Date.now},
        }
    ]
});

// virtual properties don’t get persisted in the database. They only exist logically.
userSchema.virtual('password')
    .set(function (password) {
        // create temporary variable _password
        this._password = password;
        // unique timestamp for hashing
        this.salt = uuidv1();
        // encrypt password
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// Schema methods
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    // Encrypt password
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt) // find sha1 Hash value of password with key value of salt
                .update(password) // encrypt password
                .digest('hex'); // output format
        }
        catch {
            return ""
        }
    }
}

// Create model based on the schema
module.exports = mongoose.model('User', userSchema);