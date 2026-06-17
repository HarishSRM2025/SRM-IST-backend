const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
    facultyName: String,
    facultyEmail: String,
    facultyImage: String,
    facultyGender: String,
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
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
    facultyExperience: Number,
    areaOfInterest: String
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);