const mongoose = require("mongoose");

const facultyResearchSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    // researchArea: String,

    awards_and_achievements: [{
        awardName: String,
        awardDate: Date,
        awardBy: String,
        awardLocation: String,
    }],
    publications: [{
        title: String,
        journal: String,
        year: Number,
        coAuthors: String
    }],
    patents: [{
        patentName: String,
        patentNumber: String,
        country: String,
        year: Number,
        status: String
    }],
    grants: [{
        grantTitle: String,
        fundingAgency: String,
        amount: Number,
        year: Number,
        status: String
    }],
    conferences: [{
        conferenceName: String,
        conferenceLocation: String,
        conferenceDate: Date,
        paperPresented: String
    }],
    workshop:[{
        workshopName: String,
        workshopLocation: String,
        workshopDate: Date,
    }],
    fundedProject: [{
        projectName: String,
        fundingAgency: String,
        amount: Number,
        year: Number,
        status: String
    }]
    
}, {timestamps:true})

module.exports = mongoose.model("FacultyResearch", facultyResearchSchema);