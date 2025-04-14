const mongoose = require("mongoose");
const Member = require("./member");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

teamSchema.virtual("members", {
    ref: "Member",
    localField: "_id",
    foreignField: "team"
});

teamSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const team = this;
        await team.populate('members');
        team.members.forEach(member => {
            member.team = undefined;
            member.save();
        });
        next();
    } catch (e) {
        console.log(e);
    }
}); 

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
