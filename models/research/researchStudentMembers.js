const mongoose = require("mongoose");

const researchStudentMembersSchema = new mongoose.Schema({
    researchCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResearchCenter',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    
    
})

const ResearchStudentMembers = mongoose.model('ResearchStudentMembers', researchStudentMembersSchema);

module.exports = ResearchStudentMembers;