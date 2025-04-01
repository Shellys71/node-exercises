const mongoose = require("mongoose");

const url = "mongodb+srv://Shelly:712006@cluster0.s0wvyld.mongodb.net/artech-db";

mongoose.connect(url, {
    useNewUrlParser: true
});
