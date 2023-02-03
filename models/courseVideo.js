const mongoose = require('mongoose');

const courseVideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String },
        img: { type: String },
        video: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("courseVideo", CourseVideoSchema);