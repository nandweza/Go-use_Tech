const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router
    .route('/')
    .get(adminController.getAdminPage);

router
    .route('/profile')
    .get(adminController.getAdminProfile); 

module.exports = router;
