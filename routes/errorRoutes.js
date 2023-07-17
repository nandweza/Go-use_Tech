const express = require('express');
const errorController = require('../controllers/errorController');

const router = express.Router();

router
    .route('/404')
    .get(errorController.getNotFoundPage);

module.exports = router;
