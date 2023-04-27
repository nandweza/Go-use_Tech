const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const appRouter = require('./routes/appRouter');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const port = process.env.PORT || 8001;
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
//app.use(morgan('dev'));
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

const User = require('./models/User');
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://GoUseTech:GoUseTech123@cluster0.jm1barh.mongodb.net/s?retryWrites=true&w=majority")
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => console.log(err));

app.use('/', appRouter);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});