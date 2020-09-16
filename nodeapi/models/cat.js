const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    summary: {
        type: String,
    },
});

module.exports = mongoose.model('Cat', catSchema);