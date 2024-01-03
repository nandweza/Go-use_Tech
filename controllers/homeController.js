const Post = require('../models/Post');

exports.getHomePage = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(2);

        res.render('home/home', { posts: posts });
    } catch (error) {
        console.log(error);
        res.redirect('/api/error/404');
    }
};

exports.getPrivacyPolicy = async (req, res) => {
    try {
        res.render('home/privacyPolicy');
    } catch (error) {
        console.log(error);
        res.redirect('/api/error/404');
    }
}

exports.getTermsAndConditions = async (req, res) => {
    try {
        res.render('home/termsAndConditions');
    } catch (error) {
        console.log(error);
        res.redirect('/api/error/404');
    }
}
