const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { createSchoolDivision, getAllSchoolDivision, getSchoolDivisionById, updateSchoolDivisionById, deleteSchoolDivisionById } = require("../controller/schoolDivision/schoolDivision");
const { addHODMessage, getHODMessage, getHODMessageById, updateHODMessage, deleteHODMessage } = require("../controller/schoolDivision/hodMessage");
const { createAchievement, getAllAchievements, getAchievementById, updateAchievement, deleteAchievement } = require("../controller/schoolDivision/achievements");
const { createEventsAndActivities, getAllEventsAndActivities, getEventsAndActivitiesById, updateEventsAndActivitiesById, deleteEventsAndActivitiesById } = require("../controller/schoolDivision/eventsAndActivities");

// School Division routes
router.post('/add', createSchoolDivision);
router.get('/getall', getAllSchoolDivision);
router.get('/get/:id', getSchoolDivisionById);
router.put('/update/:id', updateSchoolDivisionById);
router.delete('/delete/:id', deleteSchoolDivisionById);

// HOD Message routes
router.post('/hod-message/create', upload.single("hodImage"), addHODMessage);
router.get('/hod-message/getall', getHODMessage);
router.get('/hod-message/getone/:id', getHODMessageById);
router.put('/hod-message/update/:id', upload.single("hodImage"), updateHODMessage);
router.delete('/hod-message/delete/:id', deleteHODMessage);

// Achievements routes
router.post('/achievements/create', upload.single("achievementImage"), createAchievement);
router.get('/achievements/getall', getAllAchievements);
router.get('/achievements/getone/:id', getAchievementById);
router.put('/achievements/update/:id', upload.array("achievementImage"), updateAchievement);
router.delete('/achievements/delete/:id', deleteAchievement);

// Events & Activities routes
router.post('/events-and-activities/create', upload.array('eventImage'), createEventsAndActivities);
router.get('/events-and-activities/getall', getAllEventsAndActivities);
router.get('/events-and-activities/getone/:id', getEventsAndActivitiesById);
router.put('/events-and-activities/update/:id', upload.array('eventImage'), updateEventsAndActivitiesById);
router.delete('/events-and-activities/delete/:id', deleteEventsAndActivitiesById);

module.exports = router;
