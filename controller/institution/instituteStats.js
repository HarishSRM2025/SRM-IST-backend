const InstituteStats = require("../../models/institution/instituteStats");

const normalizeStats = (stats = []) => {
    if (!Array.isArray(stats)) return [];

    return stats
        .map((stat) => ({
            name: String(stat.name || "").trim(),
            value: Number(stat.value)
        }))
        .filter((stat) => stat.name && Number.isFinite(stat.value));
};

const createInstituteStats = async (req, res) => {
    try {
        const { instituteId, institutionId } = req.body;
        const stats = normalizeStats(req.body.instituteStats);
        const linkedInstituteId = instituteId || institutionId;

        if (!linkedInstituteId || stats.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Institution and at least one stat are required"
            });
        }

        const instituteStats = await InstituteStats.create({
            instituteId: linkedInstituteId,
            instituteStats: stats
        });

        res.status(201).json({
            success: true,
            data: instituteStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllInstituteStats = async (req, res) => {
    try {
        const instituteStats = await InstituteStats.find();
        res.status(200).json({
            success: true,
            data: instituteStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getInstituteStatsById = async (req, res) => {
    try {
        const instituteStats = await InstituteStats.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: instituteStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateInstituteStatsById = async (req, res) => {
    try {
        const { instituteId, institutionId } = req.body;
        const update = {
            instituteStats: normalizeStats(req.body.instituteStats)
        };

        if (instituteId || institutionId) {
            update.instituteId = instituteId || institutionId;
        }

        if (update.instituteStats.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one stat is required"
            });
        }

        const instituteStats = await InstituteStats.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: instituteStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const deleteInstituteStatsById = async (req, res) => {
    try {
        const instituteStats = await InstituteStats.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: instituteStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createInstituteStats,
    getAllInstituteStats,
    getInstituteStatsById,
    updateInstituteStatsById,
    deleteInstituteStatsById
};
