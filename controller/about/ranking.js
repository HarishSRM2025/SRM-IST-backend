const Ranking = require("../../models/about/ranking")

exports.createRanking = async (req, res) => {
    try {
        const { title, count } = req.body;

        if (!title || !count) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newRanking = await Ranking.create({ title, count });

        res.status(201).json(newRanking);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error creating ranking" });
    }
};

exports.getAllRankings = async (req, res) => {
    try {
        const rankings = await Ranking.find().sort({ createdAt: -1 });
        res.status(200).json(rankings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rankings" });
    }
};

exports.getRankingById = async (req, res) => {
    try {
        const ranking = await Ranking.findById(req.params.id);
        if (!ranking) {
            return res.status(404).json({ message: "Ranking not found" });
        }
        res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching ranking" });
    }
};

exports.updateRanking = async (req, res) => {
    try {
        const { title, count } = req.body;

        const updatedRanking = await Ranking.findByIdAndUpdate(
            req.params.id,
            { title, count },
            { new: true, runValidators: true }
        );

        if (!updatedRanking) {
            return res.status(404).json({ message: "Ranking not found" });
        }

        res.status(200).json(updatedRanking);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error updating ranking" });
    }
};

exports.deleteRanking = async (req, res) => {
    try {
        const deletedRanking = await Ranking.findByIdAndDelete(req.params.id);
        if (!deletedRanking) {
            return res.status(404).json({ message: "Ranking not found" });
        }
        res.status(200).json({ message: "Ranking deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting ranking" });
    }
};
