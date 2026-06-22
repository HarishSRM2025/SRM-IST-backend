const mongoose = require('mongoose');

const LeadershipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    leadershipMessage: {
        type: String,
        required: false,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Founder",
            "Chairman",
            "Vice Chairman",
            "Academic Heads",
            "Administrative Heads",
            "Leadership"
        ],
    },
    image: {
        type: String, // Image URL or file path
        required: true,
    },
    displayInHome: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Leadership', LeadershipSchema);
