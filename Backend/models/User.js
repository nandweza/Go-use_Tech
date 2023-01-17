const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, require: true },
        profilePic: { type: String, default: "" },
        isAdmin: { type: String, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);