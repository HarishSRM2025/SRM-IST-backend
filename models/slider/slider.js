const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    tagLine: {
        type: String,
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
    ctaText1: {  
        type: String,
        required: true
    },
    ctaLink1: {
        type: String,
        required: true
    },
    ctaText2: { 
        type: String,
        required: true
    },
    ctaLink2: { 
        type: String,
        required: true
    },
    sliderStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
