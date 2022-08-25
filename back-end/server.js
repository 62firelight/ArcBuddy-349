const compression = require('compression');
const express = require('express');
const cors = require('cors');
const QuriaAPI = require('quria').Quria;
const destinyApi = require('node-destiny-2');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());

const apiUrl = `http://localhost:${port}`;
const mongoUri = 'mongodb://127.0.0.1:27017';

let destiny = undefined;
exports.getDestiny = function getDestiny() {
    return destiny;
};

let accessToken = undefined;
exports.getAccessToken = function getAccessToken() {
    return accessToken;
};

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

// define routes
app.get('/', (req, res) => {
    res.send(`
      Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
      `)
});
require('./routes/destiny.routes.js')(app);
require('./routes/profiles.routes.js')(app);

const initializeServer = async () => {
    // connect to MongoDB database
    // if connection fails, then fall back to in-memory database
    try {
        console.log(`Attempting to connect to MongoDB server at ${mongoUri}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Successfully connected to MongoDB through Mongoose.\n');
    } catch (error) {
        console.log(`Couldn't connect to MongoDB through Mongoose. Using in-memory database.\n`);
        noDb = true;
    }

    // construct API wrapper object for calling the Bungie.net API
    // if connection fails, then terminate the server immediately
    try {
        console.log('Attempting to connect to Bungie.net API...')
        // destinyOld = await new destinyApi({ key: process.env.ARC_KEY });

        const quria = new QuriaAPI({
            API_KEY: process.env.ARC_KEY,
            CLIENT_ID: '37960',
            CLIENT_SECRET: process.env.CLIENT_SECRET
        });

        oauth = quria.oauth;
        destiny = quria.destiny2;

        console.log('Successfully connected to Bungie.net API.\n');
    } catch (error) {
        console.error(error);
        console.error('Failed to connect to Bungie.net API. Terminating server.\n');
        process.exit();
    }

    // Attempt to fetch access token
    // console.log('Attempting to fetch access token...')
    // const refreshResponse = await oauth.RefreshAccessToken(process.env.REFRESH_TOKEN);
    // // console.log(refreshResponse);
    // if (refreshResponse.access_token != undefined) {
    //     accessToken = refreshResponse.access_token;
    // } else {
    //     console.error(error);
    //     console.error('Failed to fetch access token. Terminating server.\n');
    //     process.exit();
    // }
    // console.log(`Access token: ${accessToken}`);
    // console.log('Successfully fetched access token.\n');
    // 3, '4611686018468181342', '2305843009301648414' (Exo Hunter)

    app.listen(port, () => {
        console.log(`Server running at ${apiUrl}.`);
    });
};

initializeServer();