const Slider = require("../../models/slider/slider");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

// Create Slider
exports.createSlider = async (req, res) => {
    try {
        const {
            tagLine,
            title,
            description,
            ctaText1,
            ctaLink1,
            ctaText2,
            ctaLink2,
            sliderStatus,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const slider = await Slider.create({
            image: req.file.filename,
            tagLine,
            title,
            description,
            ctaText1,
            ctaLink1,
            ctaText2,
            ctaLink2,
            sliderStatus,
        });

        res.status(201).json({
            success: true,
            data: slider,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create slider",
            error: error.message,
        });
    }
};

// Get All Sliders
exports.getAllSliders = async (req, res) => {
    try {
        const sliders = await Slider.find();

        res.status(200).json({
            success: true,
            data: sliders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch sliders",
            error: error.message,
        });
    }
};

// Get Slider By Id
exports.getSliderById = async (req, res) => {
    try {
        const slider = await Slider.findById(req.params.id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found",
            });
        }

        res.status(200).json({
            success: true,
            data: slider,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch slider",
            error: error.message,
        });
    }
};

// Update Slider
exports.updateSlider = async (req, res) => {
    try {
        const slider = await Slider.findById(req.params.id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found",
            });
        }

        const updatedData = {
            tagLine: req.body.tagLine,
            title: req.body.title,
            description: req.body.description,
            ctaText1: req.body.ctaText1,
            ctaLink1: req.body.ctaLink1,
            ctaText2: req.body.ctaText2,
            ctaLink2: req.body.ctaLink2,
            sliderStatus: req.body.sliderStatus,
        };

        // If new image uploaded
        if (req.file) {
            // Delete old image from uploads folder
            if (slider.image) {
                deleteUploadedFiles(slider.image);
            }

            updatedData.image = req.file.filename;
        }

        const updatedSlider = await Slider.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedSlider,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update slider",
            error: error.message,
        });
    }
};

// Delete Slider
exports.deleteSlider = async (req, res) => {
    try {
        const slider = await Slider.findById(req.params.id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found",
            });
        }

        // Delete image from uploads folder
        if (slider.image) {
            deleteUploadedFiles(slider.image);
        }

        await Slider.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Slider deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete slider",
            error: error.message,
        });
    }
};