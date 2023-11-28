// controllers/courseController.js
const Course = require('../models/Course');
// const User = require('../models/User');


//client requests

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        // res.render('course/courses', { courses });
        res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });

        // res.render('course/singleCourse', { course: course });
        res.status(200).json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}

//admin requests

exports.getCreateCoursePage = async (req, res) => {
    try {
        res.render('admin/course/createCourse');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}

exports.createCourse = async (req, res) => {
    try {
        const { title, description, author, courseImg } = req.body;
        const course = new Course({ title, description, author, courseImg });
        await course.save();
        // res.redirect('/api/courses');
        res.status(201).json({ message: 'course created!' })
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find();

        res.render('admin/course/adminCourses', { courses });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourseAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });

        res.render('admin/course/course', { course: course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}
