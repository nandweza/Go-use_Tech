const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }).lean();

        res.render('admin/allUsers', { users: users });
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
}
