const mongoose = require('mongoose');

const SchoolDivisionAchievementSchema = new mongoose.Schema({

    schoolDivisionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolDivision',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    achievementDate: {
        type: Date,
        required: true
    },
    achieverName: {
        type: String,
        required: true
    },
    achievementType: {
        type: String,
        enum: ['inter-school', 'state-level', 'national-level', 'international-level'],
        default: 'inter-school'
    },
    achievementCategory: {
        type: String,
        enum: ['academic', 'sports', 'cultural', 'science-and-technology', 'other'],
        default: 'academic'
    },
    awardOrRecognition: {
        type: String,
        required: true
    },
    achievementImage: {
        type: String
    },
    achieverDesignation: {
        type: String,
        enum: ['student', 'faculty'],
        default: 'student'
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SchoolDivisionAchievement', SchoolDivisionAchievementSchema);