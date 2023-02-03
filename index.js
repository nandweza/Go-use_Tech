const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const homeRouter = require('./routes/home');
// const authRoute = require('/routes/auth');
// const userRoute = require('/routes/users');

const port = 8000;
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
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
// app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use('/', homeRouter);
// app.use('/auth', authRoute);
// app.use('/users', userRoute);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});