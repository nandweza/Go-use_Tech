const mongoose = require('mongoose');
// const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, require: true,
                    match:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, minlength: 6},
        role: { type: String, default: "Basic", required: true },
    },
    { timestamps: true }
);

// UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("user", UserSchema);