const dotenv = require('dotenv');
const multer = require('multer');
const multiparty = require('multiparty');

const Post = require('../models/Post');

const fs = require('fs');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
// const firebaseAdmin = require('../firebase/firebaseAdmin');
// const firebaseStorage = require('../firebase/firebaseStorage');


dotenv.config();



const uploads = multer({storage: multer.memoryStorage()});

//handling image storage and upload
const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: Storage }).single('blogimg');

exports.getHomePage = async (req, res) => {
    try {
        // const [files] = await bucket.getFiles();

        // const courseData = files.map(file => {
        //   // Exclude files from the "blog" directory
        //   if (!file.name.startsWith('blog/')) {
        //     const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        //     const metadata = file.metadata;
        //     const createdAt = new Date(metadata.timeCreated);
        //     const title = metadata.title || 'Untitled';
        //     const desc = metadata.desc ? metadata.desc.substring(0, 100) : '';
        //     return {
        //       url,
        //       title,
        //       desc,
        //       createdAt,
        //       filename: file.name
        //     };
        //   }
        // });

        // // Remove any undefined entries
        // const filteredCourses = courseData.filter(course => course);

        // const sortedCourses = filteredCourses.sort((a, b) => b.createdAt - a.createdAt);

        // const courses = sortedCourses.slice(0, 3);

        const posts = await Post.find().sort({ createdAt: -1 }).limit(2);

        res.render('home/home', { posts: posts, upload });
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.redirect('/api/error/404');
    }
};
