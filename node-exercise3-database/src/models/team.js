const mongoose = require("mongoose");

const Team = mongoose.model('Team', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    leader: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: [String],
        default: []
    }
});

module.exports = Team;
