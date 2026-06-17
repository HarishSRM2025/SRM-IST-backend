const mongoose = require('mongoose');

const researchFacultyMemberSchema = new mongoose.Schema({
    researchCenterId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResearchCenter',
        required: true
    },
    facultyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    }
});     

module.exports = mongoose.model('ResearchFacultyMember', researchFacultyMemberSchema);