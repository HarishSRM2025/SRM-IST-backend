const Leadership = require("../../models/about/leadership")
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

exports.createLeadership = async (req, res) => {
    try {
        const { name, role, leadershipMessage, category, displayInHome, order } = req.body;

        const image = req.file ? (req.file.filename || req.file.path.split(/[/\\]/).pop()) : undefined;

        if (!name || !role  || !category || !image) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newLeadership = await Leadership.create({
            name,
            role,
            leadershipMessage,
            category,
            image,
            displayInHome: displayInHome === 'true' || displayInHome === true,
            order: order !== undefined && order !== '' ? Number(order) : 0
        });

        res.status(201).json(newLeadership);
    } catch (error) {
        console.error(error);
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: error.message || "Error creating leadership entry" });
    }
};

// Supports optional query filters:
//   ?category=Founder|Chairman|Vice Chairman|Academic Heads|Administrative Heads
//   ?displayInHome=true   -> used by the "Leaders In Home" tab
exports.getAllLeadership = async (req, res) => {
    try {
        const { category, displayInHome } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (displayInHome !== undefined) {
            filter.displayInHome = displayInHome === 'true';
        }

        const leadershipList = await Leadership.find(filter).sort({ order: 1, createdAt: -1 });
        res.status(200).json(leadershipList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching leadership entries" });
    }
};

exports.getLeadershipById = async (req, res) => {
    try {
        const leadership = await Leadership.findById(req.params.id);
        if (!leadership) {
            return res.status(404).json({ message: "Leadership entry not found" });
        }
        res.status(200).json(leadership);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching leadership entry" });
    }
};

exports.updateLeadership = async (req, res) => {
    try {
        const { name, role, leadershipMessage, category, displayInHome, order } = req.body;

        // Get existing leadership data
        const existingLeadership = await Leadership.findById(req.params.id);

        if (!existingLeadership) {
            return res.status(404).json({
                message: "Leadership entry not found"
            });
        }

        const updateData = {
            name,
            role,
            leadershipMessage,
            category,
            displayInHome: displayInHome === 'true' || displayInHome === true,
            order: order !== undefined && order !== '' ? Number(order) : 0
        };


        if (req.file) {

            // Delete old image
            if (existingLeadership.image) {

                const oldImagePath = path.join(
                    process.cwd(),
                    "public/uploads",
                    existingLeadership.image
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateData.image = req.file.filename || req.file.path.split(/[/\\]/).pop();

        } else if (req.body.image) {

            updateData.image = req.body.image.split(/[/\\]/).pop();

        }


        const updatedLeadership = await Leadership.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );


        res.status(200).json(updatedLeadership);

    } catch (error) {
        console.error(error);

        const statusCode = error.name === "ValidationError" ? 400 : 500;

        res.status(statusCode).json({
            message: error.message || "Error updating leadership entry"
        });
    }
};


exports.deleteLeadership = async (req, res) => {
    try {

        const leadership = await Leadership.findById(req.params.id);

        if (!leadership) {
            return res.status(404).json({
                message: "Leadership entry not found"
            });
        }


        deleteUploadedFiles(leadership.image);

        // Delete database record
        await Leadership.findByIdAndDelete(req.params.id);


        res.status(200).json({
            message: "Leadership entry deleted successfully"
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error deleting leadership entry"
        });
    }
};