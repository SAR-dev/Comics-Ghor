const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        default: 'KK6cJ5X'
    },
    cover: {
        type: String,
        default: 'NA45QCf'
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
    following: [{type: ObjectId, ref: "User"}],
    followers: [{type: ObjectId, ref: "User"}],
});

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }
        catch {
            return ""
        }
    }
}

module.exports = mongoose.model('User', userSchema);