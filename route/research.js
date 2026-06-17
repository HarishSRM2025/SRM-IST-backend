const express = require('express');
const router = express.Router();
const researchCenterController = require('../controller/research/researchCenter');
const researchFacultyMembersController = require('../controller/research/researchFacultyMembers');
const researchStudentMembersController = require('../controller/research/researchStudentMembers');

// Research Faculty Member routes
router.post('/faculty-members', researchFacultyMembersController.createResearchFacultyMember);
router.get('/faculty-members', researchFacultyMembersController.getAllResearchFacultyMembers);
router.get('/faculty-members/:id', researchFacultyMembersController.getResearchFacultyMemberById);
router.put('/faculty-members/:id', researchFacultyMembersController.updateResearchFacultyMember);
router.delete('/faculty-members/:id', researchFacultyMembersController.deleteResearchFacultyMember);

// Research Student Member routes
router.post('/student-members', researchStudentMembersController.addResearchStudentMembers);
router.get('/student-members', researchStudentMembersController.getResearchStudentMembers);
router.get('/student-members/:id', researchStudentMembersController.getResearchStudentMembersById);
router.put('/student-members/:id', researchStudentMembersController.updateResearchStudentMembers);
router.delete('/student-members/:id', researchStudentMembersController.deleteResearchStudentMembers);

// Research Center routes (/:id must come last to avoid shadowing static paths)
router.post('/', researchCenterController.createResearchCenter);
router.get('/', researchCenterController.getAllResearchCenters);
router.get('/:id', researchCenterController.getResearchCenterById);
router.put('/:id', researchCenterController.updateResearchCenter);
router.delete('/:id', researchCenterController.deleteResearchCenter);

module.exports = router;