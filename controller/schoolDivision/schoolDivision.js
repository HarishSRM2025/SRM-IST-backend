const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");

exports.createSchoolDivision = async (req, res) => {
    try {
        const { schoolId, name, slug, about } = req.body;
        const schoolDivision = await SchoolDivision.create({ schoolId, name, slug, about });
        res.status(201).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllSchoolDivision = async (req, res) => {
    try {
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
        res.status(200).json(schoolDivision);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateSchoolDivisionById = async (req, res) => {
    try {
        const {id} = req.params;
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
        await SchoolDivision.findByIdAndDelete(id);
        res.status(200).json({message: "School division deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};



