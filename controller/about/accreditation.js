const Accreditation = require("../../models/about/accreditation")
const fs = require("fs");
const path = require("path");
exports.createAccreditation = async (req, res) => {
    try {
        const { title, description } = req.body;

        const image = req.file ? (req.file.filename || req.file.path.split(/[/\\]/).pop()) : undefined;

        if (!title || !description || !image) {
            return res.status(400).json({ message: "All fields are required. Please upload an image." });
        }

        const newAccreditation = await Accreditation.create({
            title,
            description,
            image
        });

        res.status(201).json(newAccreditation);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error creating accreditation" });
    }
};

exports.getAllAccreditations = async (req, res) => {
    try {
        const accreditations = await Accreditation.find().sort({ createdAt: -1 });
        res.status(200).json(accreditations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching accreditations" });
    }
};

exports.getAccreditationById = async (req, res) => {
    try {
        const accreditation = await Accreditation.findById(req.params.id);
        if (!accreditation) {
            return res.status(404).json({ message: "Accreditation not found" });
        }
        res.status(200).json(accreditation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching accreditation" });
    }
};

exports.updateAccreditation = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Find existing accreditation
        const accreditation = await Accreditation.findById(req.params.id);

        if (!accreditation) {
            return res.status(404).json({
                message: "Accreditation not found"
            });
        }

        const updateData = {
            title,
            description
        };


        if (req.file) {

            // Delete old image
            if (accreditation.image) {

                const oldImagePath = path.join(
                    process.cwd(),
                    "public/uploads",
                    accreditation.image
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }


            updateData.image = req.file.filename || req.file.path.split(/[/\\]/).pop();

        } else if (req.body.image) {

            updateData.image = req.body.image.split(/[/\\]/).pop();

        }


        const updatedAccreditation = await Accreditation.findByIdAndUpdate(
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

        const statusCode = error.name === "ValidationError" ? 400 : 500;

        res.status(statusCode).json({
            message: error.message || "Error updating accreditation"
        });
    }
};

exports.deleteAccreditation = async (req, res) => {
    try {

        // Find existing accreditation
        const accreditation = await Accreditation.findById(req.params.id);

        if (!accreditation) {
            return res.status(404).json({
                message: "Accreditation not found"
            });
        }


        // Delete image from public/uploads
        if (accreditation.image) {

            const imagePath = path.join(
                process.cwd(),
                "public/uploads",
                accreditation.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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