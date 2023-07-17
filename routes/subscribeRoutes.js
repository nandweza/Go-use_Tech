const express = require('express');
const subscribeController = require('../controllers/subscribeController');

const router = express.Router();

router
    .route('/')
    .post(subscribeController.subscribeEmail);

router
    .route('/failure')
    .post(subscribeController.subscribeFailure);

module.exports = router;
