const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const passport = require('passport');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multiparty = require('multiparty');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const nodemailer = require('nodemailer');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject, updateMetadata } = require('firebase/storage');
const admin = require("firebase-admin");

// const { Storage } = require('@google-cloud/storage');
// const myStorage = new Storage();

dotenv.config();

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

let posts = [];

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
const uploads = multer({storage: multer.memoryStorage()});  //handling video storage

// Multer configuration for handling image uploads
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//       fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
//     },
// });

const Storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: Storage }).single('blogimg');

// home route
router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(2);
    res.render('home', { posts: posts });
});

//about route
router.get('/about', (req, res) => {
    res.render('about');
});

/* BLOG ROUTES */

//get blog page
router.get('/blog', async (req, res) => {
    posts = await Post.find().sort({createdAt: -1});
    res.render('blog', { posts: posts });
});

//get create blog page
router.get('/addPost', (req, res) => {
    res.render('addPost');
});

//get all posts by admin
router.get('/allPosts', async (req, res) => {
    posts = await Post.find().sort({ createdAt: -1});
    res.render('allPosts', {posts: posts});
});

//create blog post
router.post("/addPost", upload, (req, res) => {
    const { title, content } = req.body;
    const blogimg = req.file.filename;
    

    if (!title || !content) {
        return res.redirect("/createPost");
    }

    const posts = new Post({ title, content, blogimg });

    posts
        .save()
        .then(() => {
            console.log("Article created!!!");
            res.redirect('/admin');
        })
        .catch ((err) => console.log(err));
    });

//get single blog post
router.get("/blog/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        const posts = await Post.find().sort({ createdAt: -1 }).limit(3);
        res.render("singlePost", { post: post, posts: posts });
    } catch (err) {
        res.status(500).send("Blog not found");
    }
});

//get edit page
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const getData = await Post.findOne({ _id: id });
    res.render('edit', { post: getData });
})

//update blog
router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { blogimg } = req.file.filename;

    Post.updateOne({ _id: id }, { title, blogimg,content })
        .then(() => {
            console.log("Blog Updated!");
            res.redirect("/allPosts");
        })
        .catch((err) => console.log(err));
});

//delete blog post
router.post('/delete', (req, res) => {
    const deletedItemId = req.body.deleteBtn;

    Post.findByIdAndDelete(deletedItemId, (err) => {
        if (!err) {
            console.log("deletion success!");
            res.redirect("/allPosts");
        } else {
            console.log(err);
        }
    });
});

//Blog Routes

//get addPost page by admin
// router.get('/addPost', (req, res) => {
//     res.render('addPost');
// });

// Create a blog post
// router.post('/addPost', upload.single('img'), async (req, res) => {
//     try {
//       const { title, content } = req.body;
//       const img = req.file;
  
//       // Generate a unique filename for the blog post
//       const filename = Date.now().toString();
  
//       // Upload the image to Firebase Storage
//       const imageFile = bucket.file(`blog/${filename}-${img.originalname}`);
//       const imageUploadStream = imageFile.createWriteStream();
//       imageUploadStream.end(img.buffer);
  
//       // Save the title and content in the same file
//       const postFile = bucket.file(`blog/${filename}.txt`);
//       const postContent = `Title: ${title}\n\n${content}`;
//       await postFile.save(postContent, {
//         contentType: 'text/plain',
//       });
  
//       res.redirect('/addPost');
//     } catch (error) {
//       console.error('Error creating blog post:', error);
//       res.status(500).json({ error: 'Error creating blog post' });
//     }
// });

// // Get all blog posts
// router.get('/blog', async (req, res) => {
//     try {
//       // Get a list of files in the "blog" directory
//       const [files] = await bucket.getFiles({ prefix: 'blog/' });
  
//       // Retrieve the blog posts
//       const posts = [];

//       for (const file of files) {
//         if (file.name.endsWith('.txt')) {
//           const [content] = await file.download();
  
//           // Extract the title and content from the combined data
//           const lines = content.toString().split('\n');
//           const title = lines[0].substring(7); // Remove the "Title: " prefix
//           const postContent = lines.slice(2).join('\n'); // Combine remaining lines as post content
  
//           // Get the corresponding image file for each post
//           const imageFilename = file.name.replace('.txt', '');
//           const [imageFile] = await bucket.getFiles({ prefix: imageFilename });
//           const imageUrl = imageFile[0].publicUrl();
  
//           posts.push({
//             title,
//             content: postContent,
//             imageUrl,
//           });
//         }
//       }
  
//       res.render('blog', { posts });
//     } catch (error) {
//       console.error('Error retrieving blog posts:', error);
//     //   res.status(500).send('Error retrieving blog posts');
//     res.redirect('/404');
//     }
// });  

// //get single blog post by filename 
// router.get('/blog/:filename', async (req, res) => {
//     try {
//         const { filename } = req.params;

//         // Get the content file for the specified filename
//         const contentFile = bucket.file(`blog/${filename}.txt`);
//         const [content] = await contentFile.download();

//         // Get the corresponding image file
//         const imageFile = bucket.file(`blog/${filename}`);
//         const imageUrl = imageFile.publicUrl();

//         // Get the title file
//         const titleFile = bucket.file(`blog/${filename}.txt`);
//         const [title] = await titleFile.download();

//         // Get the createdAt property
//         const createdAtFile = bucket.file(`blog/${filename}.txt`);
//         const [createdAt] = await createdAtFile.download();
//         const parsedCreatedAt = new Date(createdAt.toString());

//         const post = {
//             title: title.toString(),
//             content: content.toString(),
//             imageUrl,
//             createdAt: parsedCreatedAt,
//         };

//         res.render('singlePost', { post });
//     } catch (error) {
//         console.error('Error retrieving blog post:', error);
//         // res.status(500).send('Error retrieving blog post');
//         res.redirect('/404');
//     }
// });

// //get all posts by admin
// router.get('/allPosts', async (req, res) => {
//     try {
//       // Get a list of files in the "blog" directory
//       const [files] = await bucket.getFiles({ prefix: 'blog/' });
  
//       // Retrieve the blog posts
//       const posts = [];
  
//       for (const file of files) {
//         if (file.name.endsWith('.txt')) {
//           const [content] = await file.download();
  
//           // Extract the title and content from the combined data
//           const lines = content.toString().split('\n');
//           const title = lines[0].substring(7); // Remove the "Title: " prefix
//           const postContent = lines.slice(2).join('\n'); // Combine remaining lines as post content
  
//           // Get the corresponding image file for each post
//           const imageFilename = file.name.replace('.txt', '');
//           const [imageFile] = await bucket.getFiles({ prefix: imageFilename });
//           const imageUrl = imageFile[0].publicUrl();
  
//           posts.push({
//             title,
//             content: postContent,
//             imageUrl,
//           });
//         }
//       }
  
//       res.render('allPosts', { posts });
//     } catch (error) {
//       console.error('Error retrieving blog posts:', error);
//       res.status(500).send('Error retrieving blog posts');
//     }
// });

//get updatePost page

//update a post

//delete a post

// contact routes

//get contact page
router.get('/contact', (req, res) => {
    res.render('contact');
});

//post contact message
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
            pass: 'Jona1234@!'
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

// Authentication Routes

// get login page
router.get('/login', (req, res) => {
    res.render('login');
});

//login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            if (user.isAdmin) {
                return res.redirect('/admin');
            } else {
            if (req.session.redirectTo) {
                const redirectTo = req.session.redirectTo;
                delete req.session.redirectTo;
                return res.redirect(redirectTo);
            }
            return res.redirect('/courses');
            }
        });
    })(req, res, next);
});

//get register page
router.get('/register', (req, res) => {
    res.render('register');
});

//register user
router.post("/register", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        country: req.body.country,
        profession: req.body.profession,
        isAdmin: false,
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.status(500).send(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/courses');
            });
        }
    });
});

// Google Auth routes
router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

router.get("/auth/google/courses", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect to courses page.
        res.redirect("/courses");
  });


// Facebook Auth routes
router.get('/auth/facebook',
    passport.authenticate('facebook')
);

router.get('/auth/facebook/courses', passport.authenticate(
    'facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/courses');
});

// Logout user
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
});

// Course Routes

//get addCourse page
router.get('/addCourse', (req, res) => {
    res.render('addCourse');
});

//post course video and metadata to firebase storage by admin
router.post('/addCourse', uploads.single("video"), (req, res) => {
    const video = req.file;
    const {title, desc, author, abtAuthor, email, twitter, linkedin, facebook} = req.body

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
            abtAuthor: abtAuthor,
            email: email,
            twitter: twitter,
            linkedin: linkedin,
            facebook: facebook
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

//retrieve all course videos and metadata from firebase storage to end user
router.get('/courses', async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
  
        const videoData = files.map(file => {
            // Exclude files from the "blog" directory
            if (!file.name.startsWith('blog/')) {
                const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                const metadata = file.metadata;
                const createdAt = new Date(metadata.timeCreated);
                const title = metadata.title || 'Untitled';
                const description = metadata.desc ? metadata.desc.substring(0, 100) : '';
                return {
                    url,
                    title,
                    description,
                    createdAt,
                    filename: file.name
                };
            }
        });
  
        // Remove any undefined entries
        const filteredVideos = videoData.filter(video => video);
  
        const sortedVideos = filteredVideos.sort((a, b) => b.createdAt - a.createdAt);
  
        if (req.isAuthenticated()) {
            res.render('courses', { videoData: sortedVideos });
        } else {
            res.render('login');
        }
        console.log("success");
    } catch (error) {
      console.error('Error retrieving videos:', error);
    //   res.status(500).send('Error retrieving videos');
    res.redirect('/404');
    }
});

//retrieve single course video and metadata from firebase storage by end user
router.get('/courses/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const StorageRef = ref(storage, filename);
      const url = await getDownloadURL(StorageRef);
      const metadata = await getMetadata(StorageRef);
      const title = metadata.customMetadata.title || 'Untitled';
      const desc = metadata.customMetadata.desc || '';
      const author = metadata.customMetadata.author || '';
      const abtAuthor = metadata.customMetadata.abtAuthor || '';
      const email = metadata.customMetadata.email || '';
      const twitter = metadata.customMetadata.twitter || '';
      const linkedin = metadata.customMetadata.linkedin || '';
      const facebook = metadata.customMetadata.facebook || '';
      const shareLink = `http://localhost:8001/share/${uuidv4()}`;

      res.render('singleCourse', 
      { 
        url, title, desc, author, abtAuthor, email, twitter, linkedin, facebook, shareLink
      });
      console.log(url);
    } catch (error) {
      console.log('Error retrieving video:', error);
    //   res.render('singleCourse', { error: 'Error retrieving video' });
      res.redirect('/404');
    }
});

//get all courses by admin
router.get('/allCourses', async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
  
        const videoData = files.map(file => {
            // Exclude files from the "blog" directory
            if (!file.name.startsWith('blog/')) {
                const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                const metadata = file.metadata;
                const createdAt = new Date(metadata.timeCreated);
                const title = metadata.title || 'Untitled';
                const desc = metadata.desc ? metadata.desc : '';
                return {
                    url,
                    title,
                    desc,
                    createdAt,
                    filename: file.name
                };
            }
        });
  
        // Remove any undefined entries
        const filteredVideos = videoData.filter(video => video);
  
        const sortedVideos = filteredVideos.sort((a, b) => b.createdAt - a.createdAt);
  
        res.render('allCourses', { videoData: sortedVideos });
        console.log("success");
    } catch (error) {
      console.error('Error retrieving videos:', error);
      res.status(500).send('Error retrieving videos');
    }
});

// GET update course page
router.get('/courses/:filename/update', async (req, res) => {
    try {
        const filename = req.params.filename;
        const StorageRef = ref(storage, filename);
        const metadata = await getMetadata(StorageRef);
        const title = metadata.customMetadata.title || '';
        const desc = metadata.customMetadata.desc || '';
        const author = metadata.customMetadata.author || '';
        const abtAuthor = metadata.customMetadata.abtAuthor || '';
        const email = metadata.customMetadata.email || '';
        const twitter = metadata.customMetadata.twitter || '';
        const linkedin = metadata.customMetadata.linkedin || '';
        const facebook = metadata.customMetadata.facebook || '';
        
        res.render('updateCourse', {
            filename,
            video: filename,
            title,
            desc,
            author,
            abtAuthor,
            email,
            twitter,
            linkedin,
            facebook
        });
    } catch (error) {
        console.log('Error retrieving video metadata:', error);
        res.render('updateCourse', { error: 'Error retrieving video metadata' });
    }
});

// Update course video metadata by admin
router.put('/courses/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const StorageRef = ref(storage, filename);
        const metadata = await getMetadata(StorageRef);

        const updatedMetadata = {
            contentType: 'video/mp4',
            customMetadata: {
                title: req.body.title || metadata.customMetadata.title,
                desc: req.body.desc || metadata.customMetadata.desc,
                author: req.body.author || metadata.customMetadata.author,
                abtAuthor: req.body.abtAuthor || metadata.customMetadata.abtAuthor,
                email: req.body.email || metadata.customMetadata.email,
                twitter: req.body.twitter || metadata.customMetadata.twitter,
                linkedin: req.body.linkedin || metadata.customMetadata.linkedin,
                facebook: req.body.facebook || metadata.customMetadata.facebook
            }
        };

        await updateMetadata(StorageRef, updatedMetadata);
        res.sendStatus(200);
    } catch (error) {
        console.log('Error updating video metadata:', error);
        res.sendStatus(500);
    }
});

// Delete course video and metadata from firebase storage by admin
router.delete('/courses/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const StorageRef = ref(storage, filename);
        await deleteObject(StorageRef);
        //res.sendStatus(200);
        res.redirect('/allCourses');
    } catch (error) {
        console.log('Error deleting video:', error);
        res.sendStatus(500);
    }
});

//search functionality
async function searchVideos(query) {
    const [files] = await bucket.getFiles();
    const searchResults = [];
  
    for (const file of files) {
        const [metadata] = await file.getMetadata();
  
        if (
            typeof metadata.title === 'string' &&
            typeof metadata.name === 'string' &&
            (metadata.title.toLowerCase().includes(query.toLowerCase()) ||
            metadata.name.toLowerCase().includes(query.toLowerCase()))
        ) {
            searchResults.push({
                name: metadata.name,
                title: metadata.title,
                url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
            });
        }
    }
  
    return searchResults;
}

//get search route
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
  
    try {
        const searchResults = await searchVideos(searchQuery);
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching videos:', error);
        // res.status(500).json({ error: 'An error occurred while searching videos.' });
        res.redirect('/404');
    }
});  

//get admin page
router.get('/admin', async (req, res) => {
    try {
        const [files] = await bucket.getFiles();

        // Count the number of course files
        const courseCount = files.reduce((count, file) => {
            if (!file.name.startsWith('blog/')) {
                count++;
            }
            return count;
        }, 0);

        const userCount = await User.countDocuments();
  
        res.render('admin', {
            courseCount: courseCount,
            userCount: userCount
        });
    } catch (error) {
        console.log('Error retrieving files:', error);
        res.status(500).send('Error retrieving files');
    }
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
});

// Donate Section

//get donate page
router.get('/donate', (req, res) => {
    res.render('donate');
});

//post a donation
router.post('/donate', (req, res) => {
    const { amount, phoneNumber } = req.body;
  
    axios
      .post('https://api.mtnuganda.co.ug/collection/v1_0/requesttopay', {
        amount,
        currency: 'UGX',
        externalId: '123', // Generate a unique ID for each payment request
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber,
        },
        payerMessage: 'Donation',
        payeeNote: 'Donation',
      })
      .then((response) => {
        // Handle the API response
        console.log(response.data);
        res.send('Payment request initiated successfully');
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        // res.status(500).send('Error occurred while initiating payment');
        res.redirect('/404');
    });
});

//404 page
router.get('/404', (req, res) => {
    res.render('404');
})

module.exports = router;
