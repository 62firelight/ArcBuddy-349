const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json());
app.use(cors());

const apiUrl = `http://localhost:${port}`

// app.listen(port, () => {;
//     console.log(`Server running at ${apiUrl}`);
// });

app.get('/', (req, res) => {
    res.send(`
  Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
  `)
});

const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
    region: "us-east-1",
    profile: "personal"
});

const putObjectCommand = async (params) => {
    const command = new PutObjectCommand(params);
    try {
        const data = await s3Client.send(command);
        console.log(await data);
        return data;
    } catch (error) {
        console.log(":(", error);
    }
}

const listObjectsCommand = async (params) => {
    const command = new ListObjectsCommand(params);
    try {
        const data = await s3Client.send(command);
        return data;
    } catch (error) {
        console.log(":(", error);
    }
}

const getObjectCommand = async (params) => {
    const command = new GetObjectCommand(params);
    try {
        const data = await s3Client.send(command);
        return data;
    } catch (error) {
        console.log(":(", error);
    }
}

const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const secretsClient = new SecretsManagerClient({
    region: "us-east-1",
    profile: "personal"
});

const getApiKey = async () => {
    const command = new GetSecretValueCommand({
        SecretId: "arc-buddy-349-api-key"
    });
    try {
        const data = await secretsClient.send(command);
        return data;
    } catch (error) {
        console.log(":(", error);
    }
}

const createClient = async() => {
    try {
        const response = await getApiKey();
        const apiKey = JSON.parse(response.SecretString).apiKey;

        console.log(`Successfully retrieved API key`);

        return new destinyApi({
            key: apiKey
        });
    } catch (error) {
        console.log("Couldn't retrieve API key from AWS Secrets Manager");
    }
}

var destiny = undefined;

// createClient().then((destinyClient) => {
//     destiny = destinyClient;
// });

const params = {
    Bucket: "arc-buddy"
};

// loop over each object in the list
listObjectsCommand(params).then((response) => {
    const objects = response.Contents;

    objects.forEach(function (object, index) {
        console.log(object.Key);

        const objectParams = {
            Bucket: "arc-buddy",
            Key: object.Key
        };

        getObjectCommand(objectParams).then((response) => {
            // Store all of data chunks returned from the response data stream 
            // into an array then use Array#join() to use the returned contents as a String
            let responseDataChunks = [];

            // Attach a 'data' listener to add the chunks of data to our array
            // Each chunk is a Buffer instance
            response.Body.on('data', chunk => responseDataChunks.push(chunk));
        
            // Once the stream has no more data, join the chunks into a string and return the string
            response.Body.once('end', () => console.log(JSON.parse(responseDataChunks.join(''))));
        })
    });
});

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
        // console.log(response.Response);
        // console.log(response.Response.mergedAllCharacters.results.allPvE.allTime);
        
        const pveStats = response.Response.mergedAllCharacters.results.allPvE.allTime;

        var characterStats = {}

        for (let [key, value] of Object.entries(pveStats)) {
            const statName = key
                // insert a space before all caps
                .replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function(str){ return str.toUpperCase(); });

            const statValue = value.basic.displayValue;

            characterStats[`${statName}`] = statValue;

            // console.log(statName + ": " + statValue);
        }

        // console.log(characterStats);

        res.status(200).send(characterStats);
    })
    .catch(err => {
        console.log(err);

        res.status(404).send('Could not find stats for specified Destiny player');
    });
});

// destiny.searchDestinyPlayer(-1, 'lxBeasterxl#6494')
//     .then(res => {
//         const data = res.Response[0];
//         console.log(data);

//         const membershipType = data.membershipType;
//         const membershipId = data.membershipId;

//         console.log(membershipType, membershipId);
//         console.log('\n\n');
//     })
//     .catch(err => {
//         console.error(`searchPlayer Error: ${err}`);
//     });

// destiny.getVendors(1, '4611686018452936098', '2305843009278477570', [402])
//     .then(res => {
//         console.log(res);
//         console.log('\n\n');
//     })
//     .catch(err => {
//          console.log(`getVendors Error: ${err}`);
//     });