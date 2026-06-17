const mongoose = require('mongoose');

const SchoolDivisionHodMessageSchema = new mongoose.Schema({
    schoolDivisionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolDivision',
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

module.exports = mongoose.model("SchoolDivisionHodMessage", SchoolDivisionHodMessageSchema);
