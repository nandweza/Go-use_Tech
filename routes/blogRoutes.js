const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router
    .route('/')
    .get(blogController.getPosts);


router
    .route('/:id')
    .get(blogController.getPost);
module.exports = router;
