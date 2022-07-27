const compression = require('compression')
const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());

const apiUrl = `http://localhost:${port}`

let noDb = false;
exports.getNoDb = function getNoDb() {
    return noDb;
}
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

let destiny = undefined;
exports.getDestiny = function getDestiny() {
    return destiny;
}
const createClient = async () => {
    try {
        const apiKey = process.env.ARC_KEY;

        return new destinyApi({
            key: apiKey
        });
    } catch (error) {
        console.log(error);
    }
};

// connect to MongoDB database
// if connection fails, then fall back to in-memory database
const mongoUri = 'mongodb://127.0.0.1:27017';
console.log(`Attempting to connect to MongoDB server at ${mongoUri}...`);
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('Successfully connected to MongoDB through Mongoose.\n');
    })
    .catch((error) => {
        // console.log(error);
        console.log(`Couldn't connect to MongoDB through Mongoose. Using in-memory database.\n`);
        noDb = true;
        // process.exit();
    })
    .finally(() => {
        // construct API wrapper object for calling the Bungie.net API
        // if connection fails, then terminate the server immediately
        console.log('Attempting to connect to Bungie.net API...')
        createClient()
            .then((destinyClient) => {
                destiny = destinyClient;
                console.log('Successfully connected to Bungie.net API.\n');

                // 3, '4611686018468181342', '2305843009301648414' (Exo Hunter)

                app.listen(port, () => {
                    console.log(`Server running at ${apiUrl}.`);
                });
            })
            .catch((error) => {
                console.log('Failed to connect to Bungie.net API.\n');
            })
    });

app.get('/', (req, res) => {
    res.send(`
      Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
      `)
});

require('./routes/destiny.routes.js')(app);
require('./routes/profiles.routes.js')(app);