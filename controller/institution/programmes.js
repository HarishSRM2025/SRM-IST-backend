const Programme = require("../../models/institution/programmes");

exports.createProgramme = async (req, res) => {
    try {
        const { institutionId, name, shortName, overview, duration, eligibility, careerPath } = req.body;
        if (req.coordinator && String(institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const newProgramme = await Programme.create({
            institutionId,
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
        const filter = req.coordinator ? { institutionId: req.coordinator.instituteId } : {};
        const programmes = await Programme.find(filter).populate("institutionId");
        res.status(200).json(programmes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching programmes" });
    }
};

exports.getProgrammeById = async (req, res) => {
    try {
        const programme = await Programme.findById(req.params.id).populate("institutionId");
        if (!programme) return res.status(404).json({ message: "Programme not found" });
        if (req.coordinator && String(programme?.institutionId?._id || programme?.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(200).json(programme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching programme" });
    }
};

exports.updateProgramme = async (req, res) => {
    try {
        const current = await Programme.findById(req.params.id);
        if (!current) return res.status(404).json({ message: "Programme not found" });
        if (req.coordinator && String(current.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { institutionId, name, shortName, overview, duration, eligibility, careerPath } = req.body;
        const updatedProgramme = await Programme.findByIdAndUpdate(req.params.id, {
            institutionId,
            name,
            shortName,
            overview,
            duration,
            eligibility,
            careerPath: Array.isArray(careerPath) ? careerPath : (careerPath ? careerPath.split(',').map(s => s.trim()) : [])
        }, { new: true });
        res.status(200).json(updatedProgramme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating programme" });
    }
};

exports.deleteProgramme = async (req, res) => {
    try {
        const current = await Programme.findById(req.params.id);
        if (!current) return res.status(404).json({ message: "Programme not found" });
        if (req.coordinator && String(current.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await Programme.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Programme deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting programme" });
    }
};
