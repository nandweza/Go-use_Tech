const mongoose = require('mongoose');
const randomUUID = require("crypto");

const lectureSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: randomUUID(),
        },
        title: {
            type: String,
            unique: true,
            required: true,
        },
        video: {
            type: String,
            required: true,
        }
    }
);

const lessonSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: randomUUID(),
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        lectures: [lectureSchema]
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
        courseImg: {
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
