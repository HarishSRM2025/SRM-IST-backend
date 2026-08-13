const GalleryAndResource = require("../../models/institution/galleryAndResource");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

exports.createGalleryAndResource = async (req, res) => {
    try {
        const {
            institutionId,
            title,
            description,
            videoLink,
            galleryType
        } = req.body;
        const pdfFile = req.files?.pdfFile?.[0]?.filename || req.body.pdfFile;
        const galleryImage = req.files?.galleryImage?.[0]?.filename || req.body.galleryImage;
        const newRecord = await GalleryAndResource.create({
            institutionId,
            title,
            description,
            galleryImage,
            videoLink,
            pdfFile,
            galleryType
        });
        res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Gallery and Resource" });
    }
}

exports.getAllGalleryAndResources = async (req, res) => {
    try {
        const filter = req.coordinator ? { institutionId: req.coordinator.instituteId } : {};
        const list = await GalleryAndResource.find(filter).populate("institutionId");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Gallery and Resource" });
    }
}

exports.getGalleryAndResourceById = async (req, res) => {
    try {
        const record = await GalleryAndResource.findById(req.params.id).populate("institutionId");
        if (!record) {
            return res.status(404).json({ message: "Gallery and Resource not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Gallery and Resource" });
    }
}

exports.updateGalleryAndResource = async (req, res) => {
    try {
        const {
            institutionId,
            title,
            description,
            videoLink,
            galleryType
        } = req.body;
        const pdfFile = req.files?.pdfFile?.[0]?.filename || req.body.pdfFile;
        const galleryImage = req.files?.galleryImage?.[0]?.filename || req.body.galleryImage;
        const updatedRecord = await GalleryAndResource.findByIdAndUpdate(req.params.id, {
            institutionId,
            title,
            description,
            galleryImage,
            videoLink,
            pdfFile,
            galleryType
        }, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: "Gallery and Resource not found" });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Gallery and Resource" });
    }
}

exports.deleteGalleryAndResource = async (req, res) => {
    try {
        const record = await GalleryAndResource.findById(req.params.id);
        const deletedRecord = await GalleryAndResource.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Gallery and Resource not found" });
        }
        deleteUploadedFiles(record.galleryImage, record.pdfFile);
        res.status(200).json({ message: "Gallery and Resource deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting Gallery and Resource" });
    }
}
