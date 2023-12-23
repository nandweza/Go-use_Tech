const express = require('express');
const adminController = require('../controllers/adminController');
const uploads = require('../middleware/imageUpload');

const router = express.Router();

router
    .route('/')
    .get(adminController.getAdminPage);

router
    .route('/profile')
    .get(adminController.getAdminProfile);

router
    .route('/blog')
    .get(adminController.getPostsAdmin);

router
    .route('/blog/:id')
    .get(adminController.getPostAdmin);

router
    .route('/blog/create')
    .get(adminController.getCreatePost)
    .post(uploads, adminController.createPost);

router
    .route('/blog/update/:id')
    .get(adminController.getUpdatePost)
    .post(uploads, adminController.updatePost);

router
    .route('/blog/delete')
    .post(adminController.deletePost);

module.exports = router;
