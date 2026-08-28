const SchoolDivisionHodMessage = require("../../models/schoolDivision/hodMessage");
const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");
const School = require("../../models/schools/schools");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

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
        let filter = {};
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'division') {
                filter = { schoolDivisionId: req.coordinator.divisionId };
            } else if (req.coordinator.mappingLevel === 'school') {
                const divisionIds = await SchoolDivision.find({ schoolId: req.coordinator.schoolId }).distinct('_id');
                filter = { schoolDivisionId: { $in: divisionIds } };
            } else if (req.coordinator.mappingLevel === 'institute') {
                const schoolIds = await School.find({ institutionId: req.coordinator.instituteId }).distinct('_id');
                const divisionIds = await SchoolDivision.find({ schoolId: { $in: schoolIds } }).distinct('_id');
                filter = { schoolDivisionId: { $in: divisionIds } };
            }
        }
        const hodMessage = await SchoolDivisionHodMessage.find(filter).populate("schoolDivisionId");
        res.status(200).json(hodMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching HOD Message" });
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

        const existing = await SchoolDivisionHodMessage.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: "HOD Message not found" });
        }

        const updateData = {
            schoolDivisionId,
            hodName,
            hodDesignation,
            message
        };

        const oldImage = existing.hodImage;

        if (req.file) {
            updateData.hodImage = req.file.filename;
        }

        const hodMessageEntry = await SchoolDivisionHodMessage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (
            req.file &&
            oldImage &&
            oldImage !== updateData.hodImage
        ) {
            setTimeout(() => {
                deleteUploadedFiles(oldImage);
            }, 1000);
        }

        res.status(200).json(hodMessageEntry);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({
            message: error.message || "Error updating HOD Message"
        });
    }
};

exports.deleteHODMessage = async (req, res) => {
    try {
        const existing = await SchoolDivisionHodMessage.findById(req.params.id);
        const hodMessage = await SchoolDivisionHodMessage.findByIdAndDelete(req.params.id)
        if (!hodMessage) {
            return res.status(404).json({ message: "HOD Message not found" })
        }
        deleteUploadedFiles(existing?.hodImage);
        res.status(200).json({ message: "HOD Message deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error deleting HOD Message" })
    }
}   
