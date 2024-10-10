const mongoose = require("mongoose");

const prayerSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    audio:{
        type: String,
    },
    // who is saying the audio
    speaker:{
        type: String,
    }
},{timestamps: true});

module.exports = mongoose.model('Prayer', prayerSchema);
