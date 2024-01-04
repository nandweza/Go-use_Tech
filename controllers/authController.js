const dotenv = require('dotenv');
const passport = require('passport');
const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    res.render('auth/login');
}

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            if (user.isAdmin) {
                return res.redirect('/api/admin/');
            } else {
            if (req.session.redirectTo) {
                const redirectTo = req.session.redirectTo;
                delete req.session.redirectTo;
                return res.redirect(redirectTo);
            }
            return res.redirect('/api/course/');
            }
        });
    })(req, res, next);
}

exports.getRegisterPage = (req, res) => {
    res.render('auth/register');
}

exports.registerUser = (req, res) => {
    const newUser = new User({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        country: req.body.country,
        profession: req.body.profession,
        isAdmin: false,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.username)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.status(500).redirect('/api/error/404');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/api/course/');
            });
        }
    });
}

//google auth controllers

exports.getGoogleProfile = passport.authenticate("google", { scope: ["profile"] })

exports.googleAuthSuccess = passport.authenticate("google", { failureRedirect: "/auth/login" }),
    function(req, res) {
    // Successful authentication, redirect to courses page.
    res.redirect("/api/course");
}

//facebook auth controllers

exports.getFacebookProfile = passport.authenticate('facebook')

exports.facebookAuthSuccess = passport.authenticate(
    'facebook', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/api/course');
}

exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
}
