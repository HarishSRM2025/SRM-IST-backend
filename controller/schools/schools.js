const School = require('../../models/schools/schools');

exports.createSchool = async (req, res) => {
    try {
        if (req.coordinator) {
            return res.status(403).json({ message: "Coordinators cannot create new schools" });
        }
        const school = await School.create(req.body);
        res.status(201).json(school);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating school" });
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        let filter = {};
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'school' || req.coordinator.mappingLevel === 'division') {
                filter = { _id: req.coordinator.schoolId };
            } else if (req.coordinator.mappingLevel === 'institute') {
                filter = { institutionId: req.coordinator.instituteId };
            }
        }
        const schools = await School.find(filter);
        res.status(200).json(schools);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching schools" });
    }
};

exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (req.coordinator && String(school?.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(200).json(school);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching school" });
    }
};

exports.updateSchool = async (req, res) => {
    try {
        const existing = await School.findById(req.params.id);
        if (req.coordinator && String(existing?.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(school);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating school" });
    }
};

exports.deleteSchool = async (req, res) => {
    try {
        const existing = await School.findById(req.params.id);
        if (req.coordinator && String(existing?.institutionId) !== String(req.coordinator.instituteId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const school = await School.findByIdAndDelete(req.params.id);
        res.status(200).json(school);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting school" });
    }
};
