const Course = require('../models/Course');
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const filename = require('../middleware/imageUpload');


//client requests

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        const user = await User.findOne();
        // const userName = req.user.username;
        // const username = userName.split('@')[0]

        res.render('course/courses', { courses, user: req.user });
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

//get updateCourse page
exports.getUpdateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const getData = await Course.findOne({ _id: courseId });
        res.render('admin/course/updateCourse', { course: getData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// update course
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, author } = req.body;
        const img = req.file ? req.file.filename : undefined;

        try {
            await Course.updateOne({ _id: courseId }, { title, img, description, author });
            res.redirect(`/api/course/admin/${courseId}`);;
        } catch (updateError) {
            console.log(updateError);
            res.status(500).json({ message: "Error updating course." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Something went wrong: ${error.message}` });
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
