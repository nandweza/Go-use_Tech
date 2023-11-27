const Course = require('../models/Course');

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

    res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

//create a lesson
exports.createLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newLesson = req.body;

    course.lessons.push(newLesson);
    await course.save();

    // res.redirect(`/api/courses/${courseId}/lessons`);
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get lectures
exports.getLectures = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessonId = req.params.lessonId;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    const lectures = lesson.lectures;
    res.status(200).json(lectures);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

//get a lecture by id
exports.getLecture = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessonId = req.params.lessonId;
    const lectureId = req.params.lectureId;

    const course = await Course.findById(courseId);
    if (course) {
      res.status(404).json({ message: "Course not found" });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    const lecture = lesson.lectures.id(lectureId);
    if (lecture) {
      res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json(lecture);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

//create lecture for the lesson
exports.createLecture = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lessonId = req.params.lessonId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = await course.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const newLecture = req.body;

    lesson.lectures.push(newLecture);
    await course.save();

    res.status(201).json(newLecture);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}
