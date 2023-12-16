exports.getAboutPage = async (req, res) => {
    try {
        res.render('about/about');
    } catch (error) {
        console.log(error);
        res.redirect('/api/error/404');
    }
};
