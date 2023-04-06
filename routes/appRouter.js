const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const multiparty = require('multiparty');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('../models/User');
const Course = require('../models/Course');
const Post = require('../models/Post');
const fs = require('fs');
const nodemailer = require('nodemailer');

let posts = [];
let courses = [];

const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: Storage }).single('img');

/*          ***home routes***             */

router.get('/', async (req, res) => {
    const courses = await Course.find().sort({createdAt: -1}).limit(6);
    const posts = await Post.find().sort({ createdAt: 1 }).limit(2);
    res.render('home', { courses: courses, posts: posts });
});

/*          ***about routes***           */

router.get('/about', (req, res) => {
    res.render('about');
});

/*         ***blog routes***           */

//get addPost page
router.get('/addPost', (req, res) => {
    res.render('addPost');
})

//post blog post
router.post('/addPost', upload, (req, res) => {
    const { title, content } = req.body;
    const img = req.file.filename;

    if (!title || !content || !img) {
        return res.redirect('/addPost');
    }

    const posts = new Post({ title, content, img })

    posts
      .save()
      .then(() => {
        console.log('Post Created!');
        res.redirect('/admin');
      })
      .catch((err) => console.log(err));
})

//get blog posts
router.get('/blog', async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('blog', { posts: posts });
})

//get single blog post
router.get("/blog/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        res.render("singlePost", { post: post });
    } catch (err) {
        res.status(500).send("Blog not found");
    }
});

/*         ***contact routes***        */

router.post('/contact', (req, res) => {
    console.log(req.body);
    // const name = req.body.name;
    // const email = req.body.email;
    // const subject = req.body.subject;
    // const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'usetech.go@gmail.com',
            pass: 'qubqkkmudpltverb'
        }
    });
    
    const mailOptions = {
        from: req.body.email,
        to: 'usetech.go@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    })
});

/* ----- register routes ----- */

//get register page
router.get('/register', (req, res) => {
    res.render('register');
});

//Register User.
router.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: (await bcrypt.hash(req.body.password, salt)),
    });

    if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    try {
        await newUser.save();
        // res.status(201).json(user);
        res.redirect('/login');
    } catch (err) {
        res.status(500).json(err);
    }
});

/* ----- login routes -----*/

// get login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = bcrypt.compare(password, user.password);
      if (validPassword) {
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/courses');
            console.log("login successfully");
            // res.status(200).json({ message: "Valid password" });
        }
      } else {
        res.redirect("/login");
        // res.status(400).json({ error: "Invalid Password" });
      }
    }
  });

/*              ***admin routes***            */

//get admin page
router.get('/admin', (req, res) => {
    const hrs = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    res.render('admin', { hrs: hrs, min: min, sec: sec,
                          day: day, month: month, year: year });
})

//get all posts by admin
router.get('/allPosts', async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('allPosts', { posts: posts });
})

/* *** course routes *** */

//courses routes
router.get('/courses', async (req, res) => {
    courses = await Course.find().sort({createdAt: -1});
    res.render('courses', { courses: courses });
});

//get addCourse page
router.get('/addCourse', (req, res) => {
    res.render('addCourse');
})

//post course
router.post('/addCourse', upload, (req, res) => {
    const { title, desc, author, abtAuthor } = req.body;
    const img = req.file.filename;
    const video = req.file.filename;

    if (!title || !desc || !author || !img) {
        return res.redirect('/addCourse');
    }

    const courses = new Course({ title, desc, author, img, video, abtAuthor })

    courses
      .save()
      .then(() => {
        console.log('Course Created!');
        res.redirect('/admin');
      })
      .catch((err) => console.log(err));
})

//get single course
router.get("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });
        const courses = await Course.find().sort({createdAt: -1}).limit(3);
        res.render("singleCourse", { course: course, courses: courses });
    } catch (err) {
        res.status(500).send("Course not found");
    }
});

//get all courses by admin
router.get('/allCourses', async (req, res) => {
    courses = await Course.find().sort({createdAt: -1});
    res.render('allCourses', { courses: courses });
})

//logout
router.get('/logout', (req, res) => {
    res.redirect('/login');
});

module.exports = router;