const express = require('express');
const courseController = require('../controllers/courseController');
const lessonController = require("../controllers/lessonController");
const uploads = require('../middleware/imageUpload');
const upload = require('../middleware/videoUpload');

const router = express.Router();

router
    .route('/create')
    .get(courseController.getCreateCoursePage)
    .post(uploads, courseController.createCourse);

router
    .route('/admin')
    .get(courseController.getCoursesAdmin);

router
    .route('/admin/:courseId')
    .get(courseController.getCourseAdmin)
    .post(upload, lessonController.createLesson)
    .get(lessonController.getLessons);

router
    .route('/admin/update/:courseId')
    .get(courseController.getUpdateCourse)
    .post(uploads, courseController.updateCourse);

router
    .route('/delete')
    .post(courseController.deleteCourse);

router
    .route('/')
    .get(courseController.getCourses);

router
    .route('/:courseId')
    .get(courseController.getCourse);

router
    .route('/:courseId/lesson/:lessonId')
    .get(lessonController.getLesson);

router
    .route('/:courseId/lesson/:lessonId/notes')
    .get(lessonController.getNotes);

router
    .route('/lesson/delete')
    .post(lessonController.deleteLesson);

module.exports = router;
