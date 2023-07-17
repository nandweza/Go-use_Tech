const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router
    .route('/')
    .get(blogController.getAllPosts);


router
    .route('/:id')
    .get(blogController.getPost);

//get all posts by admin
router
    .route('/admin')
    .get(blogController.getAllPostsAdmin);

router
    .route('/create')
    .get(blogController.getCreatePostPage)
    .post(blogController.createPost);

router
    .route('/update/:id')
    .get(blogController.getUpdatePostPage)
    .post(blogController.updatePost);

router
    .route('/delete')
    .post(blogController.deletePost)

module.exports = router;
