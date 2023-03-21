const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        img: { type: String },
        video: {type: String, required: true},
        author: {type: String},
        desc: { type: String },
        abtAuthor: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("course", CourseSchema);