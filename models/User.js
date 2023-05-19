const mongoose = require('mongoose');
// const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, require: true,
                    match:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, minlength: 6},
        role: { type: String, default: "Basic", required: true },
    },
    { timestamps: true }
);

// UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("user", UserSchema);
