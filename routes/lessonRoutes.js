const express = require('express');

const lessonController = require('../controllers/lessonController');
// const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/courses/:courseId/lessons', lessonController.getLessons);
router.post('/courses/:courseId/lesson', lessonController.createLesson);

module.exports = router;
