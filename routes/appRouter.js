const express = require('express');
const router = express.Router();

//home routes
router.get('/', (req, res) => {
    res.render('home');
});

//login routes
router.get('/login', (req, res) => {
    res.render('login');
});

//register routes
router.get('/register', (req, res) => {
    res.render('register');
});

//courses routes
router.get('/courses', (req, res) => {
    res.render('courses');
});

module.exports = router;