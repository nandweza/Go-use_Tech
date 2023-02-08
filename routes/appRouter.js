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

let posts = [];
let courses = [];

const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: Storage }).single('img');

//home routes
router.get('/', (req, res) => {
    res.render('home');
});

/* ----- register routes ----- */
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
        cpassword: (await bcrypt.hash(req.body.cpassword, salt)),
    });

    if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    if (req.body.password !== req.body.cpassword) {
        return res.status({ message: 'password does not match' })
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

//courses routes
router.get('/courses', (req, res) => {
    res.render('courses');
});

//admin routes
router.get('/admin', (req, res) => {
    res.render('admin');
})

/* *** add blog posts routes *** */

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

/* *** course routes *** */

//get course page
router.get('/addCourse', (req, res) => {
    res.render('addCourse');
})

//post course
router.post('/addCourse', upload, (req, res) => {
    const { title, desc, author } = req.body;
    const video = req.file.filename;

    if (!title || !desc || !author || !video) {
        return res.redirect('/addPost');
    }

    const courses = new Course({ title, desc, author, video })

    courses
      .save()
      .then(() => {
        console.log('Course Created!');
        res.redirect('/admin');
      })
      .catch((err) => console.log(err));
})

//logout
router.get('/logout', (req, res) => {
    res.redirect('/login');
});

module.exports = router;