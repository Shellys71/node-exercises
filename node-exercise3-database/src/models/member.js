const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    idfNumber: {
        type: Number,
        unique: true,
        required: true,
        validate(value) {
            if (value < 1000000 || value > 9999999 ) {
                throw new Error('Number must have seven digits');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password is invalid");
            }
        }
    },
    isLeader: {
        type: Boolean,
        default: false
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

memberSchema.methods.generateAuthToken = async function () {
    const memeber = this;
    const token = jwt.sign({ _id: memeber._id.toString() }, "ihaveboobies");

    memeber.tokens = memeber.tokens.concat({ token });
    await memeber.save();

    return token;
}

memberSchema.statics.findByCredentials = async (idfNumber, password) => {
    const member = await Member.findOne({ idfNumber });

    if (!member) {
        throw new Error("Unable to log in");
    }

    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch) {
        throw new Error("Unable to log in");
    }
    
    return member;
}

// Hash the plain text password before saving
memberSchema.pre("save", async function (next) {
    const member = this;

    if (member.isModified("password")) {
        member.password = await bcrypt.hash(member.password, 8);
    }

    next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
