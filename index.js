const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const appRouter = require('./routes/appRouter');
// const coursesRouter = require('./routes/courses');
// const authRoute = require('/routes/auth');
// const userRoute = require('/routes/users');
// import * as dotenv from 'dotenv';

const port = process.env.PORT || 8001;
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(/*process.env.MONGO_URL*/
                  "mongodb+srv://GoUseTech:GoUseTech123@cluster0.jm1barh.mongodb.net/s?retryWrites=true&w=majority")
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//middleware and static files
app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.static('public/styles.css'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use('/', appRouter);
//app.use('/courses', coursesRouter);
// app.use('/login', homeRouter);
// app.use('/auth', authRoute);
// app.use('/users', userRoute);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});