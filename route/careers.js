const express = require('express');
const careersController = require('../controller/careers/careers');
const jobApplicationController = require('../controller/careers/jobApplication');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/add-career', careersController.addCareer);
router.get('/get-careers', careersController.getCareers);
router.put('/update-career/:id', careersController.updateCareer);
router.delete('/delete-career/:id', careersController.deleteCareer);
router.get('/getCareerById/:id', careersController.getCareerById);
router.get('/getCareersByInstitute/:Institute', careersController.getCareersByInstitute);

router.post('/add-job-application', upload.single('resume'), jobApplicationController.addJobApplication);
router.get('/get-job-applications', jobApplicationController.getJobApplications);
router.get('/get-job-application/:id', jobApplicationController.getJobApplicationById);
router.delete('/delete-job-application/:id', jobApplicationController.deleteJobApplication);
router.get('/get-applications-by-position/:positionId', jobApplicationController.getApplicationsByPosition);

module.exports = router;
