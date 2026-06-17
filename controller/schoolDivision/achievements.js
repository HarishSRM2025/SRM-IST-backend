const SchoolDivisionAchievements = require("../../models/schoolDivision/achievements")

exports.createAchievement = async (req, res) => {
    try {
        const { schoolDivisionId, title, description, achievementDate, achieverName, achievementType, achievementCategory, awardOrRecognition, achieverDesignation, status } = req.body;
        const achievementImage = req.file ? req.file.filename : undefined;
        const newAchievement = await SchoolDivisionAchievements.create({
            schoolDivisionId,
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
        const list = await SchoolDivisionAchievements.find().populate("schoolDivisionId");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching achievements" });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const {id} = req.params;
        const achievement = await SchoolDivisionAchievements.findById(id);
        res.status(200).json(achievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching achievement" });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const {id} = req.params;
        const {schoolDivisionId, title, description, achievementDate, achieverName, achievementType, achievementCategory, awardOrRecognition, achieverDesignation, status} = req.body;
        const updateData = {
            schoolDivisionId,
            title,
            description,
            achievementDate,
            achieverName,
            achievementType,
            achievementCategory,
            awardOrRecognition,
            achieverDesignation,
            status
        };

        if (req.file) {
            updateData.achievementImage = req.file.filename || req.file.path.split(/[/\\]/).pop();
        } else if (req.body.achievementImage) {
            updateData.achievementImage = req.body.achievementImage.split(/[/\\]/).pop();
        }

        const achievement = await SchoolDivisionAchievements.findByIdAndUpdate(id, updateData, {new: true});
        res.status(200).json(achievement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating achievement" });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const {id} = req.params;
        await SchoolDivisionAchievements.findByIdAndDelete(id);
        res.status(200).json({message: "Achievement deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting achievement" });
    }
};
