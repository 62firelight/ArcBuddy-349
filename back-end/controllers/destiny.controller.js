const server = require('../server.js');
const destinyApi = require('node-destiny-2');
const QuriaAPI = require('quria').Quria;

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
        res.status(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

    const name = req.params.name;
    const id = req.params.id;

    const bungieName = name + "#" + id;

    destiny.SearchDestinyPlayerByBungieName(-1, bungieName)
        .then(response => {
            const data = response.Response[0];

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
        res.status(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.GetHistoricalStatsForAccount(membershipId, membershipType)
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
        res.status(404).send(`Couldn't create Destiny 2 API wrapper object!`);
    }

    const membershipType = req.params.type;
    const membershipId = req.params.id;

    destiny.GetProfile(membershipId, membershipType, {components: [100, 200]})
        .then(response => {
            // console.log(JSON.stringify(response.Response, null, 2));
            let profile = response.Response.profile.data.userInfo;
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

            profile.characters = fetchedCharacters;

            res.status(200).send(profile);
        })
        .catch(err => {
            console.log(err);

            res.status(404).send('Could not find characters for specified Destiny player');
        });
};

exports.getVendors = (req, res) => {
    const destiny = server.getDestiny();
    if (destiny == undefined) {
        console.log(`Couldn't create Destiny 2 API wrapper object!`);
        res.status(404).send(`Couldn't create Destiny 2 API wrapper object!`);
        return;
    }

    const accessToken = server.getAccessToken();
    if (accessToken == undefined) {
        console.log(`Couldn't retrieve OAuth access token!`);
        res.status(404).send(`Couldn't retrieve OAuth access token!`);
        return;
    }
    
    destiny.GetVendors('2305843009301648414', '4611686018468181342', 3, { components: [400, 401, 402] }, { access_token: accessToken })
        .then((response) => {

            if (response.ErrorCode == 12 || response.error == true) {
                // attempt to refresh access token for next request
                server.refreshAccessToken()
                    .then((accessToken) => {
                        server.setAccessToken(accessToken);
                    });

                res.status(404).send('Insufficient privileges');
            } else {
                res.status(200).send(response);
            }
            
        })
        .catch((error) => {
            console.error(error);

            res.status(404).send("Couldn't fetch vendors");
        });

};