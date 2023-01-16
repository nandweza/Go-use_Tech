const express = require('express');

const app = express();

const port = 4001;

app.get('/', (req, res) => {
    res.send('Welcome to Go-use Tech!');
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});