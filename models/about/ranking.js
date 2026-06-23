const mongoose = require('mongoose');

const RankingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    count: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Ranking', RankingSchema);
