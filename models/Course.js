const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        video: {
            type: String,
        },
        notes: {
            type: String,
        }
    }
)

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
        },
        img: {
            type: String
        },
        author: {
            type: String
        },
        lessons: [lessonSchema]
    },
    {timestamps: true}
);

module.exports = mongoose.model("Course", courseSchema);
