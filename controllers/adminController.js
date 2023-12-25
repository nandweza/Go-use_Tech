const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const User = require('../models/User');
const Post = require('../models/Post');
const filename = require('../middleware/imageUpload');
const { error } = require('console');

exports.getAdminPage = async (req, res) => {
    try {
        const courseCount = await Course.countDocuments();
        const userCount = await User.countDocuments({isAdmin: false});
  
        res.render('admin/admin', {
            courseCount,
            userCount
        });
    } catch (error) {
        console.log('Error retrieving files:', error);
        res.status(500).send('Error retrieving files');
    }
}

exports.getAdminProfile = async (req, res) => {
    try {
      const admin = await User.findOne({ isAdmin: true }).lean();
  
      res.render('admin/adminProfile', { admin });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}

//get posts

exports.getPostsAdmin = async (req, res) => {
    try {
        // const courses = await Course.find().sort({ createdAt: -1 });
        const posts = await Post.find().sort({ createdAt: -1 });

        // res.render('admin/course/adminCourses', { courses });
        res.render('admin/blog/posts', { posts });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getPostAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        res.status(200).render("admin/blog/post", { post });
    } catch (err) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getCreatePost = (req, res) => {
    render('admin/blog/createPost');
}

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const img = req.file.filename;


        if (!title || !content) {
            return res.redirect("/api/admin/blog/create");
        }

        const post = new Post({ title, content, img });
        await post.save()
        res.status(201).redirect('/api/admin/blog');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getUpdatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const getData = await Post.findOne({ _id: id });
        res.render('admin/blog/updatePost', { post: getData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const img = req.file ? req.file.filename : undefined;

        try {
            await Post.updateOne({ _id: id }, { title, img, content });
            res.status(200).redirect('/api/admin/blog');
        } catch (updateError) {
            console.log(updateError);
            res.status(500).json({ message: "Error updating post." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Something went wrong: ${error.message}` });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postId = req.body.deleteBtn;
  
        // Find the post by postId
        const post = await Post.findById(postId);
  
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
  
        // Delete associated images in the uploads dir
        if (post.img) {
            const imgPath = path.join(__dirname, '../public/uploads', post.img);
            fs.unlinkSync(imgPath);
        }
  
        // Remove the post from the database
        await Post.findByIdAndDelete(postId);
  
        res.redirect("/api/admin/blog");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
