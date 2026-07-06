const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
    facultyName: String,
    facultyEmail: String,
    facultyImage: String,
    facultyGender: String,
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    schoolDivision: { type: mongoose.Schema.Types.ObjectId, ref: "SchoolDivision" },
    subjects: [{
        subject: String
    }],
    educationDetails: [{
        degree: String,
        institution: String,
        specialization: String,
        year: String
    }],
    designation: String,
    facultyResearch: Number,
    facultyExperience: Number,
    areaOfInterest: String
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);