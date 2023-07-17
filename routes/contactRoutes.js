const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router
    .route('/')
    .get(contactController.getContactPage)
    .post(contactController.sendMessage);

module.exports = router;
