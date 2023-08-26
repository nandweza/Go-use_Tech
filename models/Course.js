const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
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
        lessons: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'
            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model('course', CourseSchema);
