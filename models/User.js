require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema(
    {
        username: {  type: String, unique: true },
        password: { type: String },
        isAdmin: { type: Boolean, default: false }
    },
    { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", UserSchema);

