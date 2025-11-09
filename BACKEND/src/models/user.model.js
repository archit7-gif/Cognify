


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // Ensures emails are always saved in lowercase
    },
    fullname: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;





