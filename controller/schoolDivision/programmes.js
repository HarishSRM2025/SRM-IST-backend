const Programme = require("../../models/schoolDivision/programmes");
const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");
const School = require("../../models/schools/schools");

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
        const programmes = await Programme.find(filter).populate("schoolDivisionId");
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