const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }).lean().sort({ createdAt: -1 });

        res.render('admin/allUsers', { users: users });
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.body.deleteBtn;
  
        // Find user by id
        const user = await User.findById(userId);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Remove user from the database
        await User.findByIdAndDelete(userId);
  
        res.redirect("/api/user");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
