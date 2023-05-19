const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multiparty = require('multiparty');
const User = require('../models/User');
const Course = require('../models/Course');
const Post = require('../models/Post');
const fs = require('fs');
const nodemailer = require('nodemailer');
const https = require('https');

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const admin = require("firebase-admin");

// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();

// const serviceAccount = require("../serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.STORAGE_BUCKET,
// });

// const bucket = admin.storage().bucket();


// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');


let posts = [];
let courses = [];

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const uploads = multer({storage: multer.memoryStorage()})


router.post('/addCourse', uploads.single("video"), (req, res) => {
    const video = req.file;
    const {title, desc, author, abtAuthor} = req.body

    if (!video || !title) {
        res.status(400).send("No file uploaded");
        return;
    }

    const StorageRef = ref(storage, video.originalname);

    const metadata = {
        contentType: 'video/mp4',
        customMetadata: {
            title: title,
            desc: desc,
            author: author,
            abtAuthor: abtAuthor
        }
    };
    uploadBytes(StorageRef, req.file.buffer, metadata)
    .then(() => {
        getDownloadURL(StorageRef).then(url => {
            res.redirect("/addCourse");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
    })
});


router.get('/courses', async (req, res) => {
    try {
      const [files] = await bucket.getFiles();
  
      const videoData = files.map(file => {
        const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        const metadata = file.metadata;
        const createdAt = new Date(metadata.timeCreated);
        const title = metadata.title || 'Untitled';
        return{
            url,
            title,
            description: metadata.description ? metadata.description.substring(0, 100) : '',
            createdAt,
            filename: file.name
        };
      });

      const sortedVideos = videoData.sort((a, b) => b.createdAt - a.createdAt);
  
      res.render('courses', { videoData: sortedVideos });
      console.log("success");
    } catch (error) {
      console.error('Error retrieving videos:', error);
      res.status(500).send('Error retrieving videos');
    }
});

// router.get('/courses', async (req, res) => {
//     try {
//       const [files] = await bucket.getFiles();
    
//       const videoData = files.map(file => {
//         const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
//         const metadata = file.metadata;
//         const createdAt = new Date(metadata.timeCreated);
//         const title = metadata.title || 'Untitled';
//         return {
//           url,
//           title,
//           description: metadata.description ? metadata.description.substring(0, 100) : '',
//           createdAt: createdAt.toDateString(),
//           filename: file.name
//         };
//       });
  
//       const sortedVideos = videoData.sort((a, b) => b.createdAt - a.createdAt);
    
//       res.render('courses', { videoData: sortedVideos });
//       console.log("success");
//     } catch (error) {
//       console.error('Error retrieving videos:', error);
//       res.status(500).send('Error retrieving videos');
//     }
//   }); 
  
router.get('/singleCourse/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const StorageRef = ref(storage, filename);
      const url = await getDownloadURL(StorageRef);
      const metadata = await getMetadata(StorageRef);
      const title = metadata.customMetadata.title || 'Untitled';
      const description = metadata.customMetadata.description || '';
      res.render('singleCourse', { url, title, description });
    } catch (error) {
      console.log('Error retrieving video:', error);
      res.render('singleCourse', { error: 'Error retrieving video' });
    }
});
  

// const Storage = multer.diskStorage({
//     destination: "./public/uploads",
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({ storage: Storage }).single('img');

// router.post('/addCourse', upload, (req, res) => {
//     const { title, desc, author, abtAuthor } = req.body;
//     const img = req.file.filename;
//     // const video = req.file.filename;

//     if (!title || !desc || !author || !img) {
//         return res.redirect('/addCourse');
//     }

//     const courses = new Course({ title, desc, author, img, abtAuthor })

//     courses
//       .save()
//       .then(() => {
//         console.log('Course Created!');
//         res.redirect('/admin');
//       })
//       .catch((err) => console.log(err));
// });

/*          ***home routes***             */

router.get('/', async (req, res) => {
    const courses = await Course.find().sort({createdAt: -1}).limit(3);
    const posts = await Post.find().sort({ createdAt: 1 }).limit(2);
    res.render('home', { courses: courses, posts: posts });
});

/*          ***about routes***           */

router.get('/about', (req, res) => {
    res.render('about');
});

/*         ***blog routes***           */

//get addPost page
router.get('/addPost', (req, res) => {
    res.render('addPost');
})

//post blog post
// router.post('/addPost', upload, (req, res) => {
//     const { title, content } = req.body;
//     const img = req.file.filename;

//     if (!title || !content || !img) {
//         return res.redirect('/addPost');
//     }

//     const posts = new Post({ title, content, img })

//     posts
//       .save()
//       .then(() => {
//         console.log('Post Created!');
//         res.redirect('/admin');
//       })
//       .catch((err) => console.log(err));
// })

//get blog posts
router.get('/blog', async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('blog', { posts: posts });
})

//get single blog post
router.get("/blog/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        res.render("singlePost", { post: post });
    } catch (err) {
        res.status(500).send("Blog not found");
    }
});

/*         ***contact routes***        */

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post('/contact', (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'usetech.go@gmail.com',
            pass: 'qubqkkmudpltverb'
        }
    });
    
    const mailOptions = {
        from: req.body.email,
        to: 'usetech.go@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    })
});

/* ----- register routes ----- */

//get register page
router.get('/register', (req, res) => {
    res.render('register');
});

//Register User.
router.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newUser = new User({
        email: req.body.username,
        role: req.body.role,
        password: (await bcrypt.hash(req.body.password, salt)),
    });

    if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    try {
        await newUser.save();
        // res.status(201).json(user);
        res.redirect('/login');
    } catch (err) {
        res.status(500).json(err);
    }
});

// passport.use(User.createStrategy());
// passport.use(new LocalStrategy({
//     usernameField: 'email', // this is where you do that
//     passwordField: 'password'
// },
// (email, password, done) => {
//     User.findOne({
//         email: email
//     }, (error, user) => {
//         if (error) {
//             return done(error);
//         }
//         if (!user) {
//             return done(null, false, {
//                 message: 'Username or password incorrect'
//             });
//         }

//         // Do other validation/check if any

//         return done(null, user);
//     });
// }
// ));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// router.post("/register", (req, res) => {

//     User.register({username: req.body.email}, req.body.password, function(err, user) {
//         if (err) {
//             console.log('error registering the user.');
//             res.status(500).send(err);
//             res.redirect('/register');
//         } else {
//             passport.authenticate('local')(req, res, function() {
//                 res.redirect('/login');
//             });
//         }
//     });
// });

/* ----- login routes -----*/

// get login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = bcrypt.compare(password, user.password);
      if (validPassword) {
        if (user.role === 'Admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/admin');
            console.log("login successfully");
            // res.status(200).json({ message: "Valid password" });
        }
      } else {
        res.redirect("/login");
        // res.status(400).json({ error: "Invalid Password" });
      }
    }
  });

/*              ***admin routes***            */

//get admin page
router.get('/admin', (req, res) => {
    const hrs = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    res.render('admin', { hrs: hrs, min: min, sec: sec,
                          day: day, month: month, year: year });
})

//get all posts by admin
router.get('/allPosts', async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('allPosts', { posts: posts });
})

/* *** course routes *** */

//courses routes
// router.get('/courses', async (req, res) => {
//     if (req.isAuthenticated()) {
//         courses = await Course.find().sort({createdAt: -1});
//         res.render('courses', { courses: courses });
//     } else {
//         console.log('User not authorized');
//         res.redirect('/login');
//     }
// });

// router.get('/courses', async (req, res) => {
//     courses = await Course.find().sort({ createdAt: -1 });
//     res.render('courses', {courses: courses});
// })

//get addCourse page
router.get('/addCourse', (req, res) => {
    res.render('addCourse');
})

//post course
// router.post('/addCourse', upload, (req, res) => {
//     const { title, desc, author, abtAuthor } = req.body;
//     const img = req.file.filename;
//     // const video = req.file.filename;

//     if (!title || !desc || !author || !img) {
//         return res.redirect('/addCourse');
//     }

//     const courses = new Course({ title, desc, author, img, abtAuthor })

//     courses
//       .save()
//       .then(() => {
//         console.log('Course Created!');
//         res.redirect('/admin');
//       })
//       .catch((err) => console.log(err));
// });

//get single course
router.get("/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ _id: id });
        const courses = await Course.find().sort({createdAt: -1}).limit(3);
        const comments = await Comment.find().sort({createdAt: -1});
        res.render("singleCourse", { course: course, courses: courses, comments: comments });
    } catch (err) {
        res.status(500).send("Course not found");
    }
});

//get all courses by admin
router.get('/allCourses', async (req, res) => {
    courses = await Course.find().sort({createdAt: -1});
    res.render('allCourses', { courses: courses });
});

//logout
router.get('/logout', (req, res) => {
    res.redirect('/login');
});

//subscribe section
router.post('/subscribe', (req, res) => {
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/92f01d1b30";

    const options = {
        method: "POST",
        auth: process.env.MAILCHIMP_NAME + ":" + process.env.MAILCHIMP_API
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.render("success");
        } else {
            res.render("failure");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

router.post('/failure', (req, res) => {
    res.redirect('/');
})

module.exports = router;
