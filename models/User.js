const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, require: true,
                    match:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, minlength: 6},
        cpassword: { type: String, required: true},
        role: {  type: String, default: "Basic", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);