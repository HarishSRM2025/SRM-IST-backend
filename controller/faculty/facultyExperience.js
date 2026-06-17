const facultyExperience = require('../../models/faculty/facultyExperience');

const addFacultyExperience = async (req, res) => {
    try {
        const { facultyId, industryExperience } = req.body;
        const newExperience = new facultyExperience({
            facultyId,
            industryExperience
        });
        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFacultyExperience = async (req, res) => {
    try {
        const experience = await facultyExperience.find();
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFacultyExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { facultyId, industryExperience } = req.body;
        const updatedExperience = await facultyExperience.findByIdAndUpdate(id, { facultyId, industryExperience }, { new: true });
        if (!updatedExperience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }       res.status(200).json(updatedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
};

const deleteFacultyExperience = async (req, res) => {   
    try {
        const { id } = req.params;
        const deletedExperience = await facultyExperience.findByIdAndDelete(id);
        if (!deletedExperience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }

        res.status(200).json({ message: "Faculty experience deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFacultyExperienceByFacultyId = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const experience = await facultyExperience.find({ facultyId });   
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const facultyExperienceById = async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await facultyExperience.findById(id);
        if (!experience) {
            return res.status(404).json({ message: "Faculty experience not found" });
        }
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addFacultyExperience,
    getFacultyExperience,   
    updateFacultyExperience,
    deleteFacultyExperience,
    getFacultyExperienceByFacultyId,
    facultyExperienceById
};
