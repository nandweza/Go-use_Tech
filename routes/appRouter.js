const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

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
        profilePic: req.body.profilePic,
        isAdmin: req.body.isAdmin,
        password: (await bcrypt.hash(req.body.password, salt)),
        cpassword: (await bcrypt.compare(req.body.cpassword, req.body.password)),
    });

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
        res.redirect('/courses');
        console.log("login successfully");
        // res.status(200).json({ message: "Valid password" });
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

//logout
router.get('/logout', (req, res) => {
    res.redirect('/login');
});

module.exports = router;