const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const User = require('../models/User');
const filename = require('../middleware/videoUpload');


//get all lessons

exports.getLessons = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const lessons = course.lessons;
        res.status(200).json(lessons);
        // res.render('lessons', { course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get a lesson by ID

exports.getLesson = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const lessonId = req.params.lessonId;

        const course = await Course.findById(courseId);
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        const user = await User.findOne();

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
        }

        // res.status(200).json(lesson);
        res.render('course/lesson', { lesson, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//get notes for the specific lesson

exports.getNotes = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const lessonId = req.params.lessonId;

        const course = await Course.findById(courseId);
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        const user = await User.findOne();

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
        }

        // res.status(200).json(lesson);
        res.render('course/notes', { lesson, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//create a lesson

exports.createLesson = (async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        // const newLesson = req.body;
        const { title, notes } = req.body;
        const video = req.file && req.file.filename ? req.file.filename : '';


        const newLesson = {
            title,
            video,
            notes,
        };

        course.lessons.push(newLesson);
        await course.save();

        res.redirect(`/api/course/admin/${courseId}`);
        // res.status(201).json(newLesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//delete a lesson

exports.deleteLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        // Find the course by courseId
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lesson = course.lessons.id(lessonId);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

         // Delete associated video in the uploads dir
        if (lesson.video) {
            const videoPath = path.join(__dirname, '../public/uploads', lesson.video);
            fs.unlinkSync(videoPath);
        }

        // Filter out the lesson with the specified lessonId
        course.lessons = course.lessons.filter(lesson => lesson._id.toString() !== lessonId);

        // Save the updated course
        await course.save();

        // res.status(200).json({ message: 'Lesson deleted successfully' });
        res.redirect(`/api/course/admin/${courseId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
