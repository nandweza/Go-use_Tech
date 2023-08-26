// controllers/lessonController.js
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

exports.getLessons = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('lessons');
    if (!course) {
      return res.status(404).send();
    }
    res.render('lessons', { course });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createLesson = async (req, res) => {
  try {
    const courseId = req.params._id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send();
    }

    const { title, videoUrl } = req.body;
    const lesson = new Lesson({ title, videoUrl });
    await lesson.save();

    course.lessons.push(lesson);
    await course.save();

    // res.redirect(`/api/courses/${courseId}/lessons`);
    res.status(201).json({ message: 'lesson created!' });
  } catch (error) {
    res.status(400).send(error);
  }
};
