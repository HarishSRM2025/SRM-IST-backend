const mongoose = require('mongoose');

const HodMessageSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    hodImage: {
        type: String,
        required: true
    },
    hodName: {
        type: String,
        required: true
    },
    hodDesignation: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("HODMessage", HodMessageSchema);
