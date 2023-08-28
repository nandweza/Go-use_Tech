const express = require('express');
const courseController = require('../controllers/courseController');

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

//retrieve single course video and metadata from firebase storage by end user
// router
//     .route('/:filename')
//     .get(courseController.getCourse)
//     .post(courseController.UpdateCourse)
//     .delete(courseController.deleteCourse);

// //get all courses by admin
// router
//     .route('/admin')
//     .get(courseController.getAllCourseAdmin);

// router
//     .route('/:filename/update')
//     .get(courseController.getUpdateCoursePage);

// Update course video metadata by admin
// router.put('/courses/:filename', );

// Delete course video and metadata from firebase storage by admin
// router.delete('/courses/:filename');

module.exports = router;
