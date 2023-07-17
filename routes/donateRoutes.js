const express = require('express');
const donateController = require('../controllers/donateController');

const router = express.Router();

router
    .route('/')
    .get(donateController.getDonatePage)
    .post(donateController.postDonate);

module.exports = router;
