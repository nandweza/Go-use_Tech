const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

// home route
router.route('/').get(homeController.getHomePage);

router
    .route('/privacy-policy')
    .get(homeController.getPrivacyPolicy);

router
    .route('/terms-and-conditions')
    .get(homeController.getTermsAndConditions);

module.exports = router;
