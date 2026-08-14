const mongoose = require("mongoose");

const facultyResearchSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    awards_and_achievements: [{
        type: mongoose.Schema.Types.Mixed
    }],
    publications: [{
        type: mongoose.Schema.Types.Mixed
    }],
    invited_lectures: [{
        type: mongoose.Schema.Types.Mixed
    }],
    fundedProject: [{
        type: mongoose.Schema.Types.Mixed
    }],
    professional_memberships: [{
        type: mongoose.Schema.Types.Mixed
    }],
    patents: [{
        type: mongoose.Schema.Types.Mixed
    }],
    grants: [{
        type: mongoose.Schema.Types.Mixed
    }],
    conferences: [{
        type: mongoose.Schema.Types.Mixed
    }],
    workshop: [{
        type: mongoose.Schema.Types.Mixed
    }]
}, { timestamps: true });

module.exports = mongoose.model("FacultyResearch", facultyResearchSchema);