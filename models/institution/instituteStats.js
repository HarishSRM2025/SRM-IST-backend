const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institute",
        required: true
    },
    instituteStats:[{
        name: {type: String, required: true},
        value: {type: Number, required: true}
    }]
});

module.exports = mongoose.model("InstituteStats", statsSchema);