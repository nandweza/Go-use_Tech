const express = require('express');
const blogController = require('../controllers/blogController');
// const uploads = require('../middleware/imageUpload');

const router = express.Router();

// client routes

router
    .route('/')
    .get(blogController.getPosts);


router
    .route('/:id')
    .get(blogController.getPost);

// admin routes

router
    .route('/admin')
    .get(blogController.getPostsAdmin);

router
    .route('/create')
    .get(blogController.getCreatePost)
    .post(blogController.createPost);

router
    .route('/update/:id')
    .get(blogController.getUpdatePost)
    .post(blogController.updatePost);

router
    .route('/delete')
    .post(blogController.deletePost)

module.exports = router;
