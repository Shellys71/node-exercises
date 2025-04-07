const mongoose = require("mongoose");
// const Member = require("./member");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    leader: {
        type: String,
        required: true
    }
});

teamSchema.virtual("members", {
    ref: "Member",
    localField: "_id",
    foreignField: "team"
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
