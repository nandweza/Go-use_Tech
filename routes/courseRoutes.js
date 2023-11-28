const express = require('express');
const courseController = require('../controllers/courseController');
const lessonController = require("../controllers/lessonController");

const router = express.Router();

router
    .route('/create')
    .get(courseController.getCreateCoursePage)
    .post(courseController.createCourse);

router
    .route('/admin')
    .get(courseController.getCoursesAdmin);

router
    .route('/admin/:id')
    .get(courseController.getCourseAdmin);

router
    .route('/')
    .get(courseController.getCourses);

router
    .route('/:id')
    .get(courseController.getCourse);

router
    .route('/:courseId/lessons')
    .post(lessonController.createLesson)
    .get(lessonController.getLessons);

router
    .route('/:courseId/lessons/:lessonId')
    .get(lessonController.getLesson);

router
    .route('/:courseId/lessons/:lessonId/lectures')
    .post(lessonController.createLecture)
    .get(lessonController.getLectures);

router
    .route('/:courseId/lessons/:lessonId/lectures/:lectureId');


module.exports = router;
