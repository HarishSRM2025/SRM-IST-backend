const Achievements = require("../../models/schools/achievements")

exports.createAchievement = async (req, res) => {
    try {
        const { school, title, description, achievementDate, achieverName, achievementType, achievementCategory, awardOrRecognition, achieverDesignation, status } = req.body;

        const achievementImage = req.file ? (req.file.filename || req.file.path.split(/[/\\]/).pop()) : undefined;

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
        const achievements = await Achievements.find().populate("school");
        res.status(200).json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching achievements" });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievements.findById(req.params.id).populate("school");
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
        if (!deletedAchievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting achievement" });
    }
};