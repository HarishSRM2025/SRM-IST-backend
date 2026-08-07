const SchoolDivisionEventsAndActivities = require("../../models/schoolDivision/eventsAndActivities");
const SchoolDivision = require("../../models/schoolDivision/schoolsDivision");
const School = require("../../models/schools/schools");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(process.cwd(), "public/uploads");
const toBoolean = (value) => value === true || value === "true" || value === "on" || value === "1";

exports.createEventsAndActivities = async (req, res) => {
    try {
        const {
            schoolDivisionId,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement
        } = req.body;

        // Support multiple images
        let eventImage = [];
        if (req.files && req.files.length > 0) {
            eventImage = req.files.map(f => f.filename);
        } else if (req.file) {
            eventImage = [req.file.filename];
        }
        if (eventImage.length === 0) {
            eventImage = undefined;
        }

        const newRecord = await SchoolDivisionEventsAndActivities.create({
            schoolDivisionId,
            name,
            description,
            eventDateTime,
            location,
            eventImage,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement: toBoolean(announcement)
        });

        res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Events and Activities" });
    }
};

exports.getAllEventsAndActivities = async (req, res) => {
    try {
        let filter = {};
        if (req.coordinator) {
            if (req.coordinator.mappingLevel === 'division') {
                filter = { schoolDivisionId: req.coordinator.divisionId };
            } else if (req.coordinator.mappingLevel === 'school') {
                const divisionIds = await SchoolDivision.find({ schoolId: req.coordinator.schoolId }).distinct('_id');
                filter = { schoolDivisionId: { $in: divisionIds } };
            } else if (req.coordinator.mappingLevel === 'institute') {
                const schoolIds = await School.find({ institutionId: req.coordinator.instituteId }).distinct('_id');
                const divisionIds = await SchoolDivision.find({ schoolId: { $in: schoolIds } }).distinct('_id');
                filter = { schoolDivisionId: { $in: divisionIds } };
            }
        }
        const list = await SchoolDivisionEventsAndActivities.find(filter).populate("schoolDivisionId");
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.getEventsAndActivitiesById = async (req, res) => {
    try {
        const {id} = req.params;
        const event = await SchoolDivisionEventsAndActivities.findById(id).populate("schoolDivisionId");
        if (!event) {
            return res.status(404).json({ message: "Events and Activities not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching Events and Activities" });
    }
};

exports.updateEventsAndActivitiesById = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            schoolDivisionId,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement
        } = req.body;


        // Find existing event
        const existingEvent = await SchoolDivisionEventsAndActivities.findById(id);

        if (!existingEvent) {
            return res.status(404).json({
                message: "Events and Activities not found"
            });
        }


        const updateData = {
            schoolDivisionId,
            name,
            description,
            eventDateTime,
            location,
            type,
            conductedBy,
            co_ordinator,
            resourcePerson,
            resourcePersonDesignation,
            status,
            announcement: toBoolean(announcement)
        };


        let eventImage = [];


        if (req.files && req.files.length > 0) {


            // Delete old images
            if (existingEvent.eventImage && existingEvent.eventImage.length > 0) {

                existingEvent.eventImage.forEach((image) => {

                    const oldImagePath = path.join(
                        uploadPath,
                        image
                    );

                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }

                });
            }


            // Add new images
            eventImage = req.files.map(file => file.filename);


        } else if (req.body.eventImage) {

            eventImage = Array.isArray(req.body.eventImage)
                ? req.body.eventImage
                : [req.body.eventImage];

        }


        if (eventImage.length > 0) {
            updateData.eventImage = eventImage;
        }


        const event = await SchoolDivisionEventsAndActivities.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true
            }
        );


        res.status(200).json(event);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error updating Events and Activities"
        });
    }
};

exports.deleteEventsAndActivitiesById = async (req, res) => {
    try {
        const { id } = req.params;


        // Find existing event
        const event = await SchoolDivisionEventsAndActivities.findById(id);


        if (!event) {
            return res.status(404).json({
                message: "Events and Activities not found"
            });
        }


        // Delete all images
        if (event.eventImage && event.eventImage.length > 0) {

            event.eventImage.forEach((image) => {

                const imagePath = path.join(
                    uploadPath,
                    image
                );


                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

            });
        }


        // Delete database record
        await SchoolDivisionEventsAndActivities.findByIdAndDelete(id);


        res.status(200).json({
            message: "Events and Activities deleted successfully"
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error deleting Events and Activities"
        });
    }
};