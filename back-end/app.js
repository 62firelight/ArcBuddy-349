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

require('./routes/profiles.routes.js')(app);

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

    // 3, '4611686018468181342', '2305843009301648414' (Exo Hunter)
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