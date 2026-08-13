const Slider = require("../../models/slider/slider");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");
// Create a new slider
exports.createSlider = async (req, res) => {
    try {
        const { tagLine, title, description, ctaText1, ctaLink1, ctaText2, ctaLink2, sliderStatus } = req.body;
        const image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads
        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const newSlider = new Slider({ image, tagLine, title, description, ctaText1, ctaLink1, ctaText2, ctaLink2, sliderStatus });
        await newSlider.save();
        res.status(201).json({ success: true, data: newSlider });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create slider", error: error.message });
    }       
};

// Get all sliders
exports.getAllSliders = async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.status(200).json({ success: true, data: sliders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch sliders", error: error.message });
    }
};

exports.getSliderById = async (req, res) => {
    try {
        const slider = await Slider.findById(req.params.id);    
        if (!slider) {
            return res.status(404).json({ success: false, message: "Slider not found" });
        }
        res.status(200).json({ success: true, data: slider });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch slider", error: error.message });
    }
};

exports.updateSlider = async (req, res) => {
    try {
        const {
            tagLine,
            title,
            description,
            ctaText1,
            ctaLink1,
            ctaText2,
            ctaLink2,
            sliderStatus
        } = req.body;


        // Find existing slider
        const slider = await Slider.findById(req.params.id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found"
            });
        }


        const updatedData = {
            tagLine,
            title,
            description,
            ctaText1,
            ctaLink1,
            ctaText2,
            ctaLink2,
            sliderStatus
        };


        if (req.file) {

            // Delete old image
            if (slider.image) {

                const oldImagePath = path.join(
                    process.cwd(),
                    "public/uploads",
                    path.basename(slider.image)
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }


            // Save new image
            updatedData.image = req.file.filename || req.file.path;

        }


        const updatedSlider = await Slider.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true
            }
        );


        res.status(200).json({
            success: true,
            data: updatedSlider
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update slider",
            error: error.message
        });
    }
};
exports.deleteSlider = async (req, res) => {
    try {

        const slider = await Slider.findById(req.params.id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found"
            });
        }


        deleteUploadedFiles(slider.image);

        // Delete database record
        await Slider.findByIdAndDelete(req.params.id);


        res.status(200).json({
            success: true,
            message: "Slider deleted successfully"
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete slider",
            error: error.message
        });
    }
};