const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

const db = require('./db');

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
