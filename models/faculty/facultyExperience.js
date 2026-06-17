const mongoose = require('mongoose');

const facultyExperienceSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true},
    industryExperience: [{
        companyName: String,
        role: String,
        startDate: Date,
        endDate: Date,
    }]
}, { timestamps: true });

module.exports = mongoose.model("FacultyExperience", facultyExperienceSchema);