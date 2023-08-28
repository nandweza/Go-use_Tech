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

//client requests

exports.getPosts = async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('blog/blog', { posts: posts });
}

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        const posts = await Post.find().limit(3);
        res.status(200).render("blog/singlePost", { post: post, posts: posts });
    } catch (err) {
        res.status(404).redirect("/api/error/404");
    }
}

//admin requests

exports.getPostsAdmin = async (req, res) => {
    posts = await Post.find().sort({ createdAt: -1});
    res.render('admin/blog/posts', {posts: posts});
}

exports.getCreatePost = (req, res) => {
    res.render('admin/blog/createPost');
}

exports.createPost = uploads, (req, res) => {
    const { title, content } = req.body;
    const blogimg = req.file.filename;


    if (!title || !content) {
        return res.redirect("/blog/create");
    }

    const posts = new Post({ title, content, blogimg });

    posts
        .save()
        .then(() => {
            console.log("Post created!!!");
            res.status(201).redirect('/blog/admin');
        })
        .catch ((err) => console.log(err));
}

exports.getUpdatePost = async (req, res) => {
    const { id } = req.params;
    const getData = await Post.findOne({ _id: id });
    res.render('admin/blog/updatePost', { post: getData });
}

exports.updatePost = uploads, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const blogimg = req.file.filename;

    Post.updateOne({ _id: id }, { title, blogimg, content })
        .then(() => {
            console.log("Blog Updated!");
            res.redirect("/blog/admin");
        })
        .catch((err) => console.log(err));
}

exports.deletePost = (req, res) => {
    const deletedItemId = req.body.deleteBtn;

    Post.findByIdAndDelete(deletedItemId, (err) => {
        if (!err) {
            console.log("deletion success!");
            res.redirect("/blog/admin");
        } else {
            console.log(err);
        }
    });
}
