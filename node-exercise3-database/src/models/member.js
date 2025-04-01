const mongoose = require("mongoose");
const validator = require("validator");

const Member = mongoose.model('Member', {
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    idfNumber: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 1000000 || value > 9999999 ) {
                throw new Error('Number must have seven digits');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    isOpenBase: {
        type: Boolean,
        default: true
    }
});

module.exports = Member;
