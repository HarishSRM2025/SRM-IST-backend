const mongoose = require('mongoose');

const eventsAndActivitiesSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDateTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eventImage: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['competition', 'activity', 'visit', 'workshop', 'seminar','conference', 'other'],
        required: true
    },
    conductedBy: {
        type: String
    },
    co_ordinator: {
        type: String
    },
    resourcePerson: {
        type: String
    },
    resourcePersonDesignation: {
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    announcement: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('EventsAndActivities', eventsAndActivitiesSchema);