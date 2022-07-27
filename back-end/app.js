const compression = require('compression')
const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

var noDb = false;

// read command line arguments if they were passed in
if (process.argv.length > 2) {
    const myArgs = process.argv.slice(2);
    switch (myArgs[0].toLowerCase()) {
        case '-nodb':
            console.log('noDb argument detected. Using in-memory database...');
            noDb = true;
            break;
        default:
            console.log('No command line arguments were given.');
            break;
    }
}

mongoose.connect('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('Successfully connected to MongoDB through Mongoose.');
    })
    .catch((error) => {
        console.log(error);

        console.log(`Couldn't connect to MongoDB through Mongoose. Using in-memory database...`);
        noDb = true;

        process.exit();
    });;

app.use(express.static('myapp/public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());

const apiUrl = `http://localhost:${port}`

app.get('/', (req, res) => {
    res.send(`
  Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
  `)
});

require('./routes/destiny.routes.js')(app);
require('./routes/profiles.routes.js')(app);

app.listen(port, () => {
    ;
    console.log(`Server running at ${apiUrl}`);
});