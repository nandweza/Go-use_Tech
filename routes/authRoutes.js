const express = require("express");
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/login')
    .get(authController.getLoginPage)
    .post(authController.loginUser);

router
    .route('/register')
    .get(authController.getRegisterPage)
    .post(authController.registerUser);

//google auth
router
    .route("/google")
    .get(authController.getGoogleProfile);

router
    .route("/google/courses")
    .get(authController.googleAuthSuccess);

//Facebook Auth routes
router
    .route('/facebook')
    .get(authController.getFacebookProfile);

router
    .route('/facebook/courses')
    .get(authController.facebookAuthSuccess);

router
    .route('/logout')
    .get(authController.logoutUser);

module.exports = router;
