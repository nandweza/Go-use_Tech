require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema(
    {
        username: {  type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { type: String, match:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, minlength: 6 },
        fname: { type: String },
        lname: { type: String },
        isAdmin: { type: Boolean, default: false },
        country: { type: String },
        profession: { type: String }
    },
    { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", UserSchema);

