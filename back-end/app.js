const compression = require('compression')
const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');
const { MongoClient } = require('mongodb');

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

const mongoClient = new MongoClient('mongodb://127.0.0.1:27017');

// test connection
mongoClient.connect()
    .then((result) => console.log('Successfully connected to MongoDB.'))
    .catch((error) => {
        console.log(`Couldn't connect to MongoDB. Using in-memory database...`);
        noDb = true;
    });
    
const db = mongoClient.db('test');
const profiles = db.collection('profiles');

app.use(express.static('myapp/public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors());

const CLASS_MAP = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
}

const RACE_MAP = {
    0: 'Human',
    1: 'Awoken',
    2: 'Exo'
}

const apiUrl = `http://localhost:${port}`

app.listen(port, () => {
    ;
    console.log(`Server running at ${apiUrl}`);
});

app.get('/', (req, res) => {
    res.send(`
  Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
  `)
});

const createClient = async () => {
    try {
        // const response = await getApiKey();
        // const apiKey = JSON.parse(response.SecretString).apiKey;
        const apiKey = process.env.ARC_KEY;

        console.log(`Successfully retrieved API key`);

        return new destinyApi({
            key: apiKey
        });
    } catch (error) {
        console.log("Couldn't retrieve API key from AWS Secrets Manager");
    }
}

var destiny = undefined;

createClient().then((destinyClient) => {
    destiny = destinyClient;

    // 3, '4611686018468181342'
});

var snapshots = [];

app.get("/api/players/:name/:id", async (req, res) => {
    const name = req.params.name;
    const id = req.params.id;

    const bungieName = name + "#" + id;

    destiny.searchDestinyPlayer(-1, bungieName)
        .then(response => {
            const data = response.Response[0];
            // console.log(data);

            const membershipType = data.membershipType;
            const membershipId = data.membershipId;

            // console.log(membershipType, membershipId);
            // console.log('\n\n');

            res.status(200).send(data);
        })
        .catch(err => {
            console.error(`searchPlayer Error: ${err}`);

            res.status(404).send('Could not find specified Destiny player');
        });
});

app.get("/api/players/account/:type/:id", async (req, res) => {
    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.getHistoricalStatsForAccount(membershipType, membershipId)
        .then(response => {
            // console.log(JSON.stringify(response.Response, null, 2));
            // console.log(response.Response.mergedAllCharacters.results.allPvE.allTime);

            var characterStats = {}

            // fetch merged stats for account
            characterStats.mergedStats = response.Response.mergedAllCharacters.merged.allTime;
            characterStats.pveStats = response.Response.mergedAllCharacters.results.allPvE.allTime;
            characterStats.pvpStats = response.Response.mergedAllCharacters.results.allPvP.allTime;

            // fetch stats for individual characters
            characterStats.characters = [];
            const characters = response.Response.characters;
            for (let [key, value] of Object.entries(characters)) {
                if (value.deleted == false) {
                    const character = {};
                    character.characterId = value.characterId;
                    character.mergedStats = value.merged.allTime;
                    character.pveStats = value.results.allPvE.allTime;
                    character.pvpStats = value.results.allPvP.allTime;

                    characterStats.characters.push(character);
                }
            }

            // console.log(characterStats);

            res.status(200).send(characterStats);
        })
        .catch(err => {
            console.log(err);

            res.status(404).send('Could not find stats for specified Destiny player');
        });
});

app.get("/api/players/character/:type/:id", async (req, res) => {
    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.getProfile(membershipType, membershipId, [200])
        .then(response => {
            // console.log(JSON.stringify(response.Response, null, 2));

            const characters = response.Response.characters.data;

            var fetchedCharacters = [];

            var i = 0;
            for (let [key] of Object.entries(characters)) {
                const fetchedCharacter = characters[key];

                // console.log(`${RACE_MAP[fetchedCharacter.raceType]} ${CLASS_MAP[fetchedCharacter.classType]}`);

                var newCharacter = {};
                newCharacter = {};
                newCharacter.characterId = fetchedCharacter.characterId;
                newCharacter.race = RACE_MAP[fetchedCharacter.raceType];
                newCharacter.class = CLASS_MAP[fetchedCharacter.classType];
                newCharacter.light = fetchedCharacter.light;
                newCharacter.emblem = `https://www.bungie.net${fetchedCharacter.emblemBackgroundPath}`;

                fetchedCharacters.push(newCharacter);

                i++;
            }

            // console.log(fetchedCharacters);

            res.status(200).send(fetchedCharacters);
        })
        .catch(err => {
            console.log(err);

            res.status(404).send('Could not find characters for specified Destiny player');
        });
});

app.get("/api/players/stats", async (req, res) => {
    try {
        // Retrieve snapshots of profiles from S3 bucket
        // const response = await listObjectsCommand({
        //     Bucket: "arc-buddy"
        // });

        // Retrieve snapshots of profiles from local storage (WARNING: not persistent)
        if (noDb == true) {
            const response = snapshots;
            res.status(200).send(response);
        } else {
            profiles.findOne()
                .then((response) => {
                    if (response == null) {
                        response = [];
                    } else {
                        response = [response];
                    }

                    res.status(200).send(response);
                })
                .catch((error) => {
                    throw (error);
                });
        }

    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshots");
    }
});

app.get("/api/players/:name", async (req, res) => {
    try {
        // Retrieve specific snapshot of profile from S3 bucket
        // const response = await getObjectCommand({
        //     Bucket: "arc-buddy",
        //     Key: req.params.name + ".json"
        // });

        var profile = undefined;

        // Store all of data chunks returned from the response data stream 
        // into an array then use Array#join() to use the returned contents as a String
        // let responseDataChunks = [];

        // Attach a 'data' listener to add the chunks of data to our array
        // Each chunk is a Buffer instance
        // response.Body.on('data', chunk => responseDataChunks.push(chunk));

        // Once the stream has no more data, join the chunks into a string and return the string
        // response.Body.once('end', () => {
        //     profile = JSON.parse(responseDataChunks.join(''));
        //     res.status(200).send(profile);
        // });

        // Search through snapshots array for the requested display name (WARNING: slow for large arrays)
        if (noDb == true) {
            profile = snapshots.find(element =>
                element.displayName.localeCompare(req.params.name) == 0
            );

            if (profile != undefined) {
                res.status(200).send(profile);
            }
            else {
                throw ("No profile with that display name was found!");
            }
        } else {
            profiles.findOne({
                displayName: req.params.name
            }).then((profile) => {
                res.status(200).send(profile);
            }).catch((error) => {
                throw (error);
            });
        }

    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshot for specified Destiny player");
    }
});

app.delete("/api/players/:name", async (req, res) => {
    try {
        // Delete specific snapshot of profile from S3 bucket
        // const response = await deleteObjectCommand({
        //     Bucket: "arc-buddy",
        //     Key: req.params.name + ".json"
        // });

        var origSnapshotLength = snapshots.length;

        // Delete specific snapshot of profile from array
        if (noDb == true) {
            snapshots = snapshots.filter(element =>
                element.displayName.localeCompare(req.params.name) != 0
            );

            if (snapshots.length < origSnapshotLength) console.log("Successfully deleted " + req.params.name);

            res.status(204).send();
        } else {
            profiles.deleteMany({
                displayName: req.params.name
            }).then((profile) => {
                res.status(204).send();
            }).catch((error) => {
                throw (error);
            });
        }

    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshot for specified Destiny player");
    }
});

app.post("/api/players/stats", async (req, res) => {
    try {
        // Store specific snapshot of profile in S3 bucket
        // const response = await putObjectCommand({
        //     Bucket: "arc-buddy",
        //     Key: req.body.displayName + ".json",
        //     Body: JSON.stringify(req.body)
        // });

        if (noDb == true) {
            snapshots.push(req.body);
            res.status(201).send("");
        } else {
            profiles.insertOne(req.body)
                .then(() => {
                    console.log("Successfully added " + req.body.displayName);
                    res.status(201).send("");
                }).catch((error) => {
                    throw (error);
                });
        }

    } catch (error) {
        console.log(error);

        res.status(404).send("Couldn't create snapshot for specified Destiny player");
    }
});