const app = require('./index');

const port = process.env.PORT || 8001;

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
