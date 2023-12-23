const Post = require('../models/Post');

let posts = [];

exports.getPosts = async (req, res) => {
    try {
        posts = await Post.find().sort({createdAt: -1});
        res.render('blog/posts', { posts: posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        const posts = await Post.find().limit(3);
        res.status(200).render("blog/post", { post: post, posts: posts });
    } catch (err) {
        res.status(404).redirect("/api/error/404");
    }
}
