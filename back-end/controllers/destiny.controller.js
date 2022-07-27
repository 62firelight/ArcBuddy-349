const server = require('../app.js');
const destinyApi = require('node-destiny-2');

const classMap = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
}

const raceMap = {
    0: 'Human',
    1: 'Awoken',
    2: 'Exo'
}

exports.searchDestinyPlayer = (req, res) => {
    const destiny = server.getDestiny();

    if (destiny == undefined) {
        console.log(`Couldn't create Destiny 2 API wrapper object!`);
        res.send(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

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
};

exports.getHistoricalStats = (req, res) => {
    const destiny = server.getDestiny();

    if (destiny == undefined) {
        console.log(`Couldn't create Destiny 2 API wrapper object!`);
        res.send(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.getHistoricalStatsForAccount(membershipType, membershipId)
        .then(response => {
            // console.log(JSON.stringify(response.Response, null, 2));
            // console.log(response.Response.mergedAllCharacters.results.allPvE.allTime);

            let characterStats = {}

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
};

exports.getProfile = (req, res) => {
    const destiny = server.getDestiny();

    if (destiny == undefined) {
        console.log(`Couldn't create Destiny 2 API wrapper object!`);
        res.send(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.getProfile(membershipType, membershipId, [200])
        .then(response => {
            // console.log(JSON.stringify(response.Response, null, 2));

            const characters = response.Response.characters.data;

            let fetchedCharacters = [];

            let i = 0;
            for (let [key] of Object.entries(characters)) {
                const fetchedCharacter = characters[key];

                // console.log(`${raceMap[fetchedCharacter.raceType]} ${classMap[fetchedCharacter.classType]}`);

                let newCharacter = {};
                newCharacter = {};
                newCharacter.characterId = fetchedCharacter.characterId;
                newCharacter.race = raceMap[fetchedCharacter.raceType];
                newCharacter.class = classMap[fetchedCharacter.classType];
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
};