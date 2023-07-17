const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const methodOverride = require('method-override');
const User = require('./models/User');
const homeRoutes = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const donateRoutes = require('./routes/donateRoutes');
const errorRoutes = require('./routes/errorRoutes');

dotenv.config();

//register view engine

app.set('view engine', 'ejs');
app.set('views', 'views');

//middleware and static files

app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.static('public/styles.css'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method', { methods: ['POST', 'DELETE', 'PUT'] }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(session({
  secret: "My secret place",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => console.log(err));

// Passport configuration

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

// Passport configuration - Google Strategy

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:8001/auth/google/courses",
  callbackURL: "https://go-use-tech.onrender.com/auth/google/courses",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

// Passport configuration - Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:8001/auth/facebook/courses",
  callbackURL: "https://go-use-tech.onrender.com/auth/facebook/courses"
},
(accessToken, refreshToken, profile, done) => {
  User.findOrCreate({ facebookId: profile.id }, (err, user) => {
    return done(err, user);
  });
}
));

app.use('/api/', homeRoutes);
app.use('/api/about/', aboutRoutes);
app.use('/api/blog/', blogRoutes);
app.use('/api/contact/', contactRoutes);
app.use('/auth/', authRoutes);
app.use('/api/course/', courseRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/subscribe/', subscribeRoutes);
app.use('/api/donate/', donateRoutes);
app.use('/api/error/', errorRoutes);

module.exports = app;
