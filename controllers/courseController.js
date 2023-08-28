// controllers/courseController.js
const Course = require('../models/Course');
// const User = require('../models/User');


//client requests

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        res.render('course/courses', { courses });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });

        res.render('course/singleCourse', { course: course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}

//admin requests

exports.getCreateCoursePage = async (req, res) => {
    try {
        res.render('admin/course/createCourse');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}

exports.createCourse = async (req, res) => {
    try {
        const { title, description, author, courseImg } = req.body;
        const course = new Course({ title, description, author, courseImg });
        await course.save();
        // res.redirect('/api/courses');
        res.status(201).json({ message: 'course created!' })
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find();

        res.render('admin/course/adminCourses', { courses });
        // res.status(200).json({ message: 'success', courses });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.getCourseAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });

        res.render('admin/course/course', { course: course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong!' });
    }
}





// const dotenv = require('dotenv');
// const multer = require('multer');
// const multiparty = require('multiparty');
// const User = require('../models/User');

// const fs = require('fs');
// const nodemailer = require('nodemailer');
// const https = require('https');
// const { v4: uuidv4 } = require('uuid');

// const { initializeApp } = require('firebase/app');
// const { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject, updateMetadata } = require('firebase/storage');
// const admin = require("firebase-admin");

// // const { Storage } = require('@google-cloud/storage');
// // const myStorage = new Storage();

// dotenv.config();

// const serviceAccount = require("../serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.STORAGE_BUCKET,
// });

// const bucket = admin.storage().bucket();

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// const uploads = multer({storage: multer.memoryStorage()});
// // const firebaseAdmin = require('../firebase/firebaseAdmin');
// // const firebaseStorage = require('../firebase/firebaseStorage');

// exports.getCreateCoursePage = (req, res) => {
//     res.render('addCourse');
// }

// exports.createCourse = uploads.single("video"), (req, res) => {
//     const video = req.file;
//     const {title, desc, author, abtAuthor, email, twitter, linkedin, facebook} = req.body

//     if (!video || !title) {
//         res.status(400).send("No file uploaded");
//         return;
//     }

//     const StorageRef = ref(storage, video.originalname);

//     const metadata = {
//         contentType: 'video/mp4',
//         customMetadata: {
//             title: title,
//             desc: desc,
//             author: author,
//             abtAuthor: abtAuthor,
//             email: email,
//             twitter: twitter,
//             linkedin: linkedin,
//             facebook: facebook
//         }
//     };
//     uploadBytes(StorageRef, req.file.buffer, metadata)
//     .then(() => {
//         getDownloadURL(StorageRef).then(url => {
//             res.redirect("/addCourse");
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).send(err);
//         })
//     })
// };

// exports.getAllCourses = async (req, res) => {
//     try {
//         const [files] = await bucket.getFiles();
  
//         const videoData = files.map(file => {
//             // Exclude files from the "blog" directory
//             if (!file.name.startsWith('blog/')) {
//                 const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
//                 const metadata = file.metadata;
//                 const createdAt = new Date(metadata.timeCreated);
//                 const title = metadata.title || 'Untitled';
//                 const description = metadata.desc ? metadata.desc.substring(0, 100) : '';
//                 return {
//                     url,
//                     title,
//                     description,
//                     createdAt,
//                     filename: file.name
//                 };
//             }
//         });
  
//         // Remove any undefined entries
//         const filteredVideos = videoData.filter(video => video);
  
//         const sortedVideos = filteredVideos.sort((a, b) => b.createdAt - a.createdAt);
  
//         let firstName = 'User';
//         let lastName = 'User';
  
//         if (req.isAuthenticated()) {
//             const userId = req.user.id;
//             const user = await User.findById(userId).lean();
//             if (user) {
//                 firstName = user.fname || 'User';
//                 lastName = user.lname || ' ';
//             }
  
//             res.render('courses', { videoData: sortedVideos, firstName, lastName });
//         } else {
//             res.render('login');
//         }
  
//         console.log('success');
//     } catch (error) {
//         console.error('Error retrieving videos:', error);
//         res.redirect('/404');
//     }
// };

// exports.getCourse = async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const StorageRef = ref(storage, filename);
//         const url = await getDownloadURL(StorageRef);
//         const metadata = await getMetadata(StorageRef);
//         const title = metadata.customMetadata.title || 'Untitled';
//         const desc = metadata.customMetadata.desc || '';
//         const author = metadata.customMetadata.author || '';
//         const abtAuthor = metadata.customMetadata.abtAuthor || '';
//         const email = metadata.customMetadata.email || '';
//         const twitter = metadata.customMetadata.twitter || '';
//         const linkedin = metadata.customMetadata.linkedin || '';
//         const facebook = metadata.customMetadata.facebook || '';
//         const shareLink = `http://localhost:8001/share/${uuidv4()}`;
  
        // let firstName = 'User';
        // let lastName = 'User';
  
        // if (req.isAuthenticated()) {
        //     const userId = req.user.id;
        //     const user = await User.findById(userId).lean();
        //     if (user) {
        //         firstName = user.fname || 'User';
        //         lastName = user.lname || 'User';
        //     }
  
//             res.render('singleCourse', {
//                 url,
//                 title,
//                 desc,
//                 author,
//                 abtAuthor,
//                 email,
//                 twitter,
//                 linkedin,
//                 facebook,
//                 shareLink,
//                 firstName,
//                 lastName
//             });
//         } else {
//             res.render('login');
//         }
  
//         console.log('success');
//     } catch (error) {
//         console.log('Error retrieving video:', error);
//         res.redirect('/404');
//     }
// };

// exports.getAllCourseAdmin = async (req, res) => {
//     try {
//         const [files] = await bucket.getFiles();
  
//         const videoData = files.map(file => {
//             // Exclude files from the "blog" directory
//             if (!file.name.startsWith('blog/')) {
//                 const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
//                 const metadata = file.metadata;
//                 const createdAt = new Date(metadata.timeCreated);
//                 const title = metadata.title || 'Untitled';
//                 const desc = metadata.desc ? metadata.desc : '';
//                 return {
//                     url,
//                     title,
//                     desc,
//                     createdAt,
//                     filename: file.name
//                 };
//             }
//         });
  
//         // Remove any undefined entries
//         const filteredVideos = videoData.filter(video => video);
  
//         const sortedVideos = filteredVideos.sort((a, b) => b.createdAt - a.createdAt);
  
//         res.render('allCourses', { videoData: sortedVideos });
//         console.log("success");
//     } catch (error) {
//       console.error('Error retrieving videos:', error);
//       res.status(500).send('Error retrieving videos');
//     }
// }

// exports.getUpdateCoursePage = async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const StorageRef = ref(storage, filename);
//         const metadata = await getMetadata(StorageRef);
//         const title = metadata.customMetadata.title || '';
//         const desc = metadata.customMetadata.desc || '';
//         const author = metadata.customMetadata.author || '';
//         const abtAuthor = metadata.customMetadata.abtAuthor || '';
//         const email = metadata.customMetadata.email || '';
//         const twitter = metadata.customMetadata.twitter || '';
//         const linkedin = metadata.customMetadata.linkedin || '';
//         const facebook = metadata.customMetadata.facebook || '';
        
//         res.render('updateCourse', {
//             filename,
//             video: filename,
//             title,
//             desc,
//             author,
//             abtAuthor,
//             email,
//             twitter,
//             linkedin,
//             facebook
//         });
//     } catch (error) {
//         console.log('Error retrieving video metadata:', error);
//         res.render('updateCourse', { error: 'Error retrieving video metadata' });
//     }
// }

// exports.UpdateCourse = async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const StorageRef = ref(storage, filename);
//         const metadata = await getMetadata(StorageRef);

//         const updatedMetadata = {
//             contentType: 'video/mp4',
//             customMetadata: {
//                 title: req.body.title || metadata.customMetadata.title,
//                 desc: req.body.desc || metadata.customMetadata.desc,
//                 author: req.body.author || metadata.customMetadata.author,
//                 abtAuthor: req.body.abtAuthor || metadata.customMetadata.abtAuthor,
//                 email: req.body.email || metadata.customMetadata.email,
//                 twitter: req.body.twitter || metadata.customMetadata.twitter,
//                 linkedin: req.body.linkedin || metadata.customMetadata.linkedin,
//                 facebook: req.body.facebook || metadata.customMetadata.facebook
//             }
//         };

//         await updateMetadata(StorageRef, updatedMetadata);
//         // res.sendStatus(200);
//         res.redirect('/allCourses');
//     } catch (error) {
//         console.log('Error updating video metadata:', error);
//         res.sendStatus(500);
//     }
// }

// exports.deleteCourse = async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const StorageRef = ref(storage, filename);
//         await deleteObject(StorageRef);
//         //res.sendStatus(200);
//         res.redirect('/allCourses');
//     } catch (error) {
//         console.log('Error deleting video:', error);
//         res.sendStatus(500);
//     }
// }
