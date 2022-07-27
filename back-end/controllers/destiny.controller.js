const destinyApi = require('node-destiny-2');

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

exports.searchDestinyPlayer = (req, res) => {
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
};

exports.getProfile = (req, res) => {
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
};