const Course = require('../models/Course');
const multer = require('multer');
const filename = require('../middleware/videoUpload');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'path-to-upload-folder'); // Set the path to the folder where you want to store uploaded files
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//   },
// });

// const storage = multer.diskStorage({
//     destination: "./public/uploads",
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const uploads = multer({ storage: storage }).single('video');

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

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // res.status(200).json(lesson);
    res.render('course/lesson', { lesson });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

exports.getNotes = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessonId = req.params.lessonId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // res.status(200).json(lesson);
    res.render('course/notes', { lesson });
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
    const courseId = req.params.courseId;
    const lessonId = req.params.lessonId;

    // Find the course by courseId
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the lesson by lessonId
    const lesson = course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove the lesson from the lessons array
    lesson.remove();

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

