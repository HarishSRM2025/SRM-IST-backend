const SchoolDivisionHodMessage = require("../../models/schoolDivision/hodMessage")

exports.addHODMessage = async (req, res) => {
    try {
        const { schoolDivisionId, hodName, hodDesignation, message } = req.body;
        const hodImage = req.file ? req.file.filename : undefined  ;

        if (!schoolDivisionId || !hodName || !hodDesignation || !message || !hodImage) {
            return res.status(400).json({ message: "All fields are required. Please upload an HOD image." });
        }

        const hodMessageEntry = await SchoolDivisionHodMessage.create({
            schoolDivisionId,
            hodImage,
            hodName,
            hodDesignation,
            message
        });

        res.status(201).json(hodMessageEntry);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error adding HOD Message" });
    }
}

exports.getHODMessage = async (req, res) => {
    try {
        const hodMessage = await SchoolDivisionHodMessage.find().populate("schoolDivisionId")
        res.status(200).json(hodMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching HOD Message" })
    }
}

exports.getHODMessageById = async (req, res) => {
    try {
        const hodMessage = await SchoolDivisionHodMessage.findById(req.params.id).populate("schoolDivisionId")
        if (!hodMessage) {
            return res.status(404).json({ message: "HOD Message not found" })
        }
        res.status(200).json(hodMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching HOD Message" })
    }
}

exports.updateHODMessage = async (req, res) => {
    try {
        const { schoolDivisionId, hodName, hodDesignation, message } = req.body;
        const updateData = {
            schoolDivisionId,
            hodName,
            hodDesignation,
            message
        };

        if (req.file) {
            updateData.hodImage = req.file.filename || req.file.path.split(/[/\\]/).pop();
        } else if (req.body.hodImage) {
            updateData.hodImage = req.body.hodImage.split(/[/\\]/).pop();
        }

        const hodMessageEntry = await SchoolDivisionHodMessage.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!hodMessageEntry) {
            return res.status(404).json({ message: "HOD Message not found" });
        }

        res.status(200).json(hodMessageEntry);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error updating HOD Message" });
    }
}

exports.deleteHODMessage = async (req, res) => {
    try {
        const hodMessage = await SchoolDivisionHodMessage.findByIdAndDelete(req.params.id)
        if (!hodMessage) {
            return res.status(404).json({ message: "HOD Message not found" })
        }
        res.status(200).json({ message: "HOD Message deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error deleting HOD Message" })
    }
}   
