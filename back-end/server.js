const compression = require('compression');
const express = require('express');
const cors = require('cors');
const QuriaAPI = require('quria').Quria;
const destinyApi = require('node-destiny-2');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const fs = require('fs');
const extract = require('extract-zip');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());

const apiUrl = `http://localhost:${port}`;
const mongoUri = 'mongodb://127.0.0.1:27017';

let isEmpty = exports.isEmpty = function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
};

let convertHash = exports.convertHash = function convertHash(hash) {
    return hash >> 32;
};

let unzipManifest = exports.unzipManifest = async function unzipManifest() {
    console.log('Unzipping manifest archive...');
    try {
        await extract('./manifest.zip', { dir: `${__dirname}/manifest` });
        console.log('Extraction of manifest complete.');
    } catch (err) {
        console.log(err);
        console.log('Something bad happened when unzipping the manifest.');
    }
};

let loadManifest = exports.loadManifest = async function loadManifest() {
    try {
        const manifestFiles = fs.readdirSync('./manifest');
        if (manifestFiles.length <= 0) {
            throw ('No files in manifest folder!');
        }
        const manifestFile = manifestFiles[0];

        db = new sqlite3.Database(`./manifest/${manifestFile}`);
        console.log('Successfully loaded manifest.\n')

        // db.serialize(() => {
        //     const titanId = convertHash('2803282938');
        //     // const adaId = convertHash('350061650');

        //     // -1491684358
        //     db.each(`SELECT * FROM DestinyRaceDefinition WHERE id = ${titanId};`, (err, row) => {
        //         // console.log(row.id + ": " + row.info);
        //         console.log(JSON.parse(row.json));
        //         // console.log(JSON.stringify(row.json, null, 2));
        //     });
        // });
        // db.close();
    } catch (err) {
        console.log(err);
        console.log("Couldn't open Destiny Manifest.\n");
    }
};

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
};

let db = undefined;
exports.getDb = function getDb() {
    return db;
};

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
require('./routes/manifest.routes.js')(app);

const initializeServer = async () => {
    // connect to MongoDB database
    // if connection fails, then fall back to in-memory database
    try {
        console.log(`Attempting to connect to MongoDB server at ${mongoUri}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Successfully connected to MongoDB through Mongoose.\n');
    } catch (err) {
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
    } catch (err) {
        console.log(err);
        console.log('Failed to connect to Bungie.net API. Terminating server.\n');
        process.exit();
    }
    // 3, '4611686018468181342', '2305843009301648414' (Exo Hunter)

    // Download Destiny manifest
    if (isEmpty('./manifest') == false && fs.existsSync('./manifest.zip')) {
        console.log('Manifest file detected.');
        await loadManifest();
    } else if (isEmpty('./manifest') && fs.existsSync('./manifest.zip')) {
        console.log('Manifest archive detected but no manifest file detected. Unzipping manifest...');
        await unzipManifest();
        await loadManifest();
    } else {
        console.log('No manifest file and/or archive detected. Attempting to download manifest...');
        await new Promise(async (resolve, reject) => {
            try {
                // fetch manifest from API
                const manifestResponse = await destiny.GetDestinyManifest();

                // check if API response was correct
                if (manifestResponse.Response.mobileWorldContentPaths.en === undefined) {
                    throw ('Manifest not found.');
                }

                const manifestLocation = `https://www.bungie.net${manifestResponse.Response.mobileWorldContentPaths.en}`;                
                const file = fs.createWriteStream("manifest.zip");
                
                // download manifest
                console.log('Manifest location found. Downloading manifest...');
                https.get(manifestLocation, (manifest) => {
                    manifest.pipe(file);
                    file.on("finish", async () => {
                        file.close();
                        console.log("Download of manifest completed.");

                        await unzipManifest();
                        await loadManifest();

                        resolve();
                    }).on('error', err => {
                        throw(err);
                    });
                });
            } catch (err) {
                console.log(err);
                reject();
            }
        });
    }

    // Attempt to fetch access token
    // console.log('Attempting to fetch access token...')
    // const refreshResponse = await oauth.RefreshAccessToken(process.env.REFRESH_TOKEN);
    // // console.log(refreshResponse);
    // if (refreshResponse.access_token != undefined) {
    //     accessToken = refreshResponse.access_token;
    // } else {
    //     console.log(error);
    //     console.log('Failed to fetch access token. Terminating server.\n');
    //     process.exit();
    // }
    // console.log(`Access token: ${accessToken}`);
    // console.log('Successfully fetched access token.\n');    

    app.listen(port, () => {
        console.log(`Server running at ${apiUrl}.`);
    });
};

initializeServer();