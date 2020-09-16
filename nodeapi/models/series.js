const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'V2iOd4H'
    },
    summary: {
        type: String,
    },
    shortSummary: {
        type: String
    },
    createdBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            text: String,
            image: String,
            created: {type: Date, default: Date.now},
            postedBy: {type: ObjectId, ref: "User"}
        }
    ],
    score: [
        {
            score: String,
            postedBy: {type: ObjectId, ref: "User"}
        }
    ],
});

module.exports = mongoose.model('Series', seriesSchema);