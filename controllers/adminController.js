const User = require('../models/User');

exports.getAdminPage = async (req, res) => {
    try {
        // const [files] = await bucket.getFiles();

        // // Count the number of course files
        // const courseCount = files.reduce((count, file) => {
        //     if (!file.name.startsWith('blog/')) {
        //         count++;
        //     }
        //     return count;
        // }, 0);

        const userCount = await User.countDocuments({isAdmin: false});
  
        res.render('admin/admin', {
            // courseCount: courseCount,
            userCount: userCount
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
