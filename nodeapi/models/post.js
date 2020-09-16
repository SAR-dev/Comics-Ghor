const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    image: {
        type: Array
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    seriesOf: {
        type: ObjectId,
        ref: "Series"
    },
    catOf: {
        type: ObjectId,
        ref: "Cat"
    },
    typeOf: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    thumbnail: {
        type: String
    },
    summary: {
        type: String
    },
    likes: [{type: ObjectId, ref: "User"}],
    comments: [
        {
            text: String,
            image: String,
            created: {type: Date, default: Date.now},
            postedBy: {type: ObjectId, ref: "User"}
        }
    ],
    commentsCount: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('Post', postSchema);