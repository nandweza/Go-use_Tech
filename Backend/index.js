const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const port = 3000;
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to Go-use Tech!');
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});