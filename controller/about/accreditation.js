const Accreditation = require("../../models/about/accreditation");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

// Create Accreditation
exports.createAccreditation = async (req, res) => {
    try {
        const { title, description } = req.body;

        const image = req.file
            ? (req.file.filename || req.file.path.split(/[/\\]/).pop())
            : undefined;

        if (!title || !description || !image) {
            return res.status(400).json({
                message: "All fields are required. Please upload an image."
            });
        }

        const newAccreditation = await Accreditation.create({
            title,
            description,
            image
        });

        res.status(201).json(newAccreditation);
    } catch (error) {
        console.error(error);

        const statusCode =
            error.name === "ValidationError" ? 400 : 500;

        res.status(statusCode).json({
            message: error.message || "Error creating accreditation"
        });
    }
};

// Get All Accreditations
exports.getAllAccreditations = async (req, res) => {
    try {
        const accreditations = await Accreditation.find().sort({
            createdAt: -1
        });

        res.status(200).json(accreditations);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching accreditations"
        });
    }
};

// Get Accreditation By Id
exports.getAccreditationById = async (req, res) => {
    try {
        const accreditation = await Accreditation.findById(
            req.params.id
        );

        if (!accreditation) {
            return res.status(404).json({
                message: "Accreditation not found"
            });
        }

        res.status(200).json(accreditation);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching accreditation"
        });
    }
};

// Update Accreditation
exports.updateAccreditation = async (req, res) => {
    try {
        const { title, description } = req.body;

        const accreditation = await Accreditation.findById(
            req.params.id
        );

        if (!accreditation) {
            return res.status(404).json({
                message: "Accreditation not found"
            });
        }

        const updateData = {
            title,
            description
        };

        // New image uploaded
        if (req.file) {
            // Delete old image
            if (accreditation.image) {
                deleteUploadedFiles(accreditation.image);
            }

            updateData.image =
                req.file.filename ||
                req.file.path.split(/[/\\]/).pop();
        }
        // Image sent as path/string
        else if (req.body.image) {
            updateData.image =
                req.body.image.split(/[/\\]/).pop();
        }

        const updatedAccreditation =
            await Accreditation.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

        res.status(200).json(updatedAccreditation);
    } catch (error) {
        console.error(error);

        const statusCode =
            error.name === "ValidationError" ? 400 : 500;

        res.status(statusCode).json({
            message: error.message || "Error updating accreditation"
        });
    }
};

// Delete Accreditation
exports.deleteAccreditation = async (req, res) => {
    try {
        const accreditation = await Accreditation.findById(
            req.params.id
        );

        if (!accreditation) {
            return res.status(404).json({
                message: "Accreditation not found"
            });
        }

        // Delete image from uploads folder
        if (accreditation.image) {
            deleteUploadedFiles(accreditation.image);
        }

        // Delete database record
        await Accreditation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Accreditation deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error deleting accreditation"
        });
    }
};