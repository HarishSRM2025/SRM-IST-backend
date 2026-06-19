const Programme = require("../../models/schoolDivision/programmes");

exports.createProgramme = async (req, res) => {
    try {
        const { schoolDivisionId, name, shortName, overview, duration, eligibility, careerPath } = req.body;

        const newProgramme = await Programme.create({
            schoolDivisionId,
            name,
            shortName,
            overview,
            duration,
            eligibility,
            careerPath: Array.isArray(careerPath) ? careerPath : (careerPath ? careerPath.split(',').map(s => s.trim()) : [])
        });

        res.status(201).json(newProgramme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating programme" });
    }
};

exports.getAllProgrammes = async (req, res) => {
    try {
        const programmes = await Programme.find().populate("schoolDivisionId");
        res.status(200).json(programmes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching programmes" });
    }
};

exports.getProgrammeById = async (req, res) => {
    try {
        const programme = await Programme.findById(req.params.id).populate("schoolDivisionId");
        if (!programme) {
            return res.status(404).json({ message: "Programme not found" });
        }
        res.status(200).json(programme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching programme" });
    }
};

exports.updateProgramme = async (req, res) => {
    try {
        const { schoolDivisionId, name, shortName, overview, duration, eligibility, careerPath } = req.body;

        const updatedProgramme = await Programme.findByIdAndUpdate(req.params.id, {
            schoolDivisionId,
            name,
            shortName,
            overview,
            duration,
            eligibility,
            careerPath: Array.isArray(careerPath) ? careerPath : (careerPath ? careerPath.split(',').map(s => s.trim()) : [])
        }, { new: true });

        if (!updatedProgramme) {
            return res.status(404).json({ message: "Programme not found" });
        }

        res.status(200).json(updatedProgramme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating programme" });
    }
};

exports.deleteProgramme = async (req, res) => {
    try {
        const deletedProgramme = await Programme.findByIdAndDelete(req.params.id);
        if (!deletedProgramme) {
            return res.status(404).json({ message: "Programme not found" });
        }
        res.status(200).json({ message: "Programme deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting programme" });
    }
};