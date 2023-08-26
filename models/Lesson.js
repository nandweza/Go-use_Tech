const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        videoUrl: {
            type: String
        }
    }
);

module.exports = mongoose.model('lesson', LessonSchema);
