const mongoose = require('mongoose');

const ProgrammeSchema = new mongoose.Schema({
    schoolDivisionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolDivision'
    },
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    careerPath: [{
        type: String,
    }]

}, { timestamps: true });

module.exports = mongoose.model('SchoolDivisionProgramme', ProgrammeSchema);