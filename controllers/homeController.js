const Post = require('../models/Post');

exports.getHomePage = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(2);

        res.render('home/home', { posts: posts });
    } catch (error) {
        console.error(error);
        res.redirect('/api/error/404');
    }
};
