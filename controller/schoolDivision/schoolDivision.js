const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");
const School = require("../../models/schools/schools");

exports.createSchoolDivision = async (req, res) => {
    try {
        const { schoolId, name, slug, about } = req.body;
        if (req.coordinator) {
            return res.status(403).json({ message: "Coordinators cannot create new divisions" });
        }
        const schoolDivision = await SchoolDivision.create({ schoolId, name, slug, about });
        res.status(201).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllSchoolDivision = async (req, res) => {
    try {
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'division') {
                const schoolDivision = await SchoolDivision.find({ _id: req.coordinator.divisionId });
                return res.status(200).json(schoolDivision);
            }
            if (req.coordinator.mappingLevel === 'school') {
                const schoolDivision = await SchoolDivision.find({ schoolId: req.coordinator.schoolId });
                return res.status(200).json(schoolDivision);
            }
            const schools = await School.find({ institutionId: req.coordinator.instituteId });
            const schoolIds = schools.map((item) => item._id);
            const schoolDivision = await SchoolDivision.find({ schoolId: { $in: schoolIds } });
            return res.status(200).json(schoolDivision);
        }
        const schoolDivision = await SchoolDivision.find();
        res.status(200).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getSchoolDivisionById = async (req, res) => {
    try {
        const {id} = req.params;
        const schoolDivision = await SchoolDivision.findById(id);
        if (req.coordinator) {
            const school = await School.findById(schoolDivision?.schoolId);
            if (!school || String(school.institutionId) !== String(req.coordinator.instituteId) || (req.coordinator.mappingLevel === 'school' && String(school._id) !== String(req.coordinator.schoolId)) || (req.coordinator.mappingLevel === 'division' && String(schoolDivision?._id) !== String(req.coordinator.divisionId))) {
                return res.status(403).json({ message: "Forbidden" });
            }
        }
        res.status(200).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateSchoolDivisionById = async (req, res) => {
    try {
        const {id} = req.params;
        const current = await SchoolDivision.findById(id);
        if (req.coordinator) {
            const school = await School.findById(current?.schoolId);
            if (!school || String(school.institutionId) !== String(req.coordinator.instituteId) || (req.coordinator.mappingLevel === 'school' && String(school._id) !== String(req.coordinator.schoolId)) || (req.coordinator.mappingLevel === 'division' && String(current?._id) !== String(req.coordinator.divisionId))) {
                return res.status(403).json({ message: "Forbidden" });
            }
        }
        const {schoolId, name, slug, about} = req.body;
        const schoolDivision = await SchoolDivision.findByIdAndUpdate(id, {schoolId, name, slug, about}, {new: true});
        res.status(200).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteSchoolDivisionById = async (req, res) => {
    try {
        const {id} = req.params;
        const current = await SchoolDivision.findById(id);
        if (req.coordinator) {
            const school = await School.findById(current?.schoolId);
            if (!school || String(school.institutionId) !== String(req.coordinator.instituteId) || (req.coordinator.mappingLevel === 'school' && String(school._id) !== String(req.coordinator.schoolId)) || (req.coordinator.mappingLevel === 'division' && String(current?._id) !== String(req.coordinator.divisionId))) {
                return res.status(403).json({ message: "Forbidden" });
            }
        }
        await SchoolDivision.findByIdAndDelete(id);
        res.status(200).json({message: "School division deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};



