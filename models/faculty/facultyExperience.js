const mongoose = require('mongoose');

const facultyExperienceSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    workExperience: [{
        type: mongoose.Schema.Types.Mixed
    }],
    industryExperience: [{
        type: mongoose.Schema.Types.Mixed
    }]
}, { timestamps: true });

module.exports = mongoose.model("FacultyExperience", facultyExperienceSchema);