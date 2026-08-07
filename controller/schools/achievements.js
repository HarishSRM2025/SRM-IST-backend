const Achievements = require("../../models/schools/achievements")
const School = require("../../models/schools/schools")

exports.createAchievement = async (req, res) => {
    try {
        const { school, title, description, achievementDate, achieverName, achievementType, achievementCategory, awardOrRecognition, achieverDesignation, status } = req.body;
        if (req.coordinator && String(school) !== String(req.coordinator.schoolId) && String(req.coordinator.mappingLevel) !== 'institute') {
            return res.status(403).json({ message: "Forbidden" });
        }

        const achievementImage = req.file ? (req.file.filename || req.file.path.split(/[/\\]/).pop()) : undefined;

        if (!school || !title || !description || !achievementDate || !achieverName || !achievementType || !achievementCategory || !awardOrRecognition || !achievementImage || !achieverDesignation || !status) {
            return res.status(400).json({ message: "All fields are required. Please upload an achievement image." });
        }

        const newAchievement = await Achievements.create({
            school,
            title,
            description,
            achievementDate,
            achieverName,
            achievementType,
            achievementCategory,
            awardOrRecognition,
            achievementImage,
            achieverDesignation,
            status
        });

        res.status(201).json(newAchievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating achievement" });
    }
};

exports.getAllAchievements = async (req, res) => {
    try {
        let filter = {};
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'school' || req.coordinator.mappingLevel === 'division') {
                filter = { school: req.coordinator.schoolId };
            } else if (req.coordinator.mappingLevel === 'institute') {
                const schoolIds = await School.find({ institutionId: req.coordinator.instituteId }).distinct('_id');
                filter = { school: { $in: schoolIds } };
            }
        }
        const achievements = await Achievements.find(filter).populate("school");
        res.status(200).json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching achievements" });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievements.findById(req.params.id).populate("school");
        if (req.coordinator && req.coordinator.mappingLevel !== 'institute' && String(achievement?.school?._id || achievement?.school) !== String(req.coordinator.schoolId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        res.status(200).json(achievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching achievement" });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const { school, title, description, achievementDate, achieverName, achievementType, achievementCategory, awardOrRecognition, achieverDesignation, status } = req.body;

        const achievementImage = req.file 
            ? (req.file.filename || req.file.path.split(/[/\\]/).pop()) 
            : (req.body.achievementImage ? req.body.achievementImage.split(/[/\\]/).pop() : undefined);

        const updatedAchievement = await Achievements.findByIdAndUpdate(req.params.id, {
            school,
            title,
            description,
            achievementDate,
            achieverName,
            achievementType,
            achievementCategory,
            awardOrRecognition,
            achievementImage,
            achieverDesignation,
            status
        }, { new: true });
        if (req.coordinator && req.coordinator.mappingLevel !== 'institute' && String(updatedAchievement?.school?._id || updatedAchievement?.school) !== String(req.coordinator.schoolId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!updatedAchievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }

        res.status(200).json(updatedAchievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating achievement" });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const deletedAchievement = await Achievements.findByIdAndDelete(req.params.id);
        if (req.coordinator && req.coordinator.mappingLevel !== 'institute' && String(deletedAchievement?.school?._id || deletedAchievement?.school) !== String(req.coordinator.schoolId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!deletedAchievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting achievement" });
    }
};
