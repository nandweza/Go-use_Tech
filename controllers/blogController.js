const dotenv = require('dotenv');
const multer = require('multer');
const Post = require('../models/Post');

let posts = [];

const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage: Storage }).single('blogimg');

exports.getAllPosts = async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('blog', { posts: posts });
}

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        const posts = await Post.find().limit(3);
        res.status(200).render("singlePost", { post: post, posts: posts });
    } catch (err) {
        res.status(404).redirect("/api/error/404");
    }
}

exports.getAllPostsAdmin = async (req, res) => {
    posts = await Post.find().sort({ createdAt: -1});
    res.render('allPosts', {posts: posts});
}

exports.getCreatePostPage = (req, res) => {
    res.render('addPost');
}

exports.createPost = uploads, (req, res) => {
    const { title, content } = req.body;
    const blogimg = req.file.filename;


    if (!title || !content) {
        return res.redirect("/addPost");
    }

    const posts = new Post({ title, content, blogimg });

    posts
        .save()
        .then(() => {
            console.log("Post created!!!");
            res.status(201).redirect('/allPosts');
        })
        .catch ((err) => console.log(err));
}

exports.getUpdatePostPage = async (req, res) => {
    const { id } = req.params;
    const getData = await Post.findOne({ _id: id });
    res.render('updatePost', { post: getData });
}

exports.updatePost = uploads, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const blogimg = req.file.filename;

    Post.updateOne({ _id: id }, { title, blogimg, content })
        .then(() => {
            console.log("Blog Updated!");
            res.redirect("/allPosts");
        })
        .catch((err) => console.log(err));
}

exports.deletePost = (req, res) => {
    const deletedItemId = req.body.deleteBtn;

    Post.findByIdAndDelete(deletedItemId, (err) => {
        if (!err) {
            console.log("deletion success!");
            res.redirect("/allPosts");
        } else {
            console.log(err);
        }
    });
}
