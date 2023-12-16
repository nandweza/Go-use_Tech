const Course = require('../models/Course');
// const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const filename = require('../middleware/imageUpload');


//client requests

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.render('course/courses', { courses });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({ _id: courseId });

        res.render('course/singleCourse', { course: course });
        // res.status(200).json(course);
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
        const { title, description, author } = req.body;
        const img = req.file && req.file.filename ? req.file.filename : '';

        const course = new Course({ title, description, author, img });
        await course.save();
        res.redirect('/api/course/admin');
        // res.status(201).json({ message: 'course created!' });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

exports.getCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.render('admin/course/adminCourses', { courses });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourseAdmin = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({ _id: courseId });
        const lessons = await course.lessons

        res.render('admin/course/course', { course: course, lessons });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}

//delete course

exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.body.deleteBtn;
  
        // Find the course by courseId
        const course = await Course.findById(courseId);
  
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
  
        // Delete associated images in the uploads dir
        if (course.img) {
            const imgPath = path.join(__dirname, '../public/uploads', course.img);
            fs.unlinkSync(imgPath);
        }
  
        // Remove the course from the database
        await Course.findByIdAndDelete(courseId);
  
        res.redirect("/api/course/admin");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
