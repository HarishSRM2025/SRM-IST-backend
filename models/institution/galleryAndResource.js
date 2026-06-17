const mongoose = require("mongoose");

const galleryAndResourceSchema = new mongoose.Schema({
    institutionId: {
        type: String,
        required: true,
        ref: 'Institution'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    galleryImage: {
        type: String
    },
    videoLink: {
        type: String
    },
    pdfFile: {
        type: String
    },
    galleryType: {
        type: String,
        enum: ['photos', 'videos', 'downloads', 'reports'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("GalleryAndResource", galleryAndResourceSchema);