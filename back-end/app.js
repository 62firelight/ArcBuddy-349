const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json());
app.use(cors());

const apiUrl = `http://localhost:${port}`

app.listen(port, () => {;
    console.log(`Server running at ${apiUrl}`);
});

app.get('/', (req, res) => {
    res.send(`
  Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
  `)
});

const destiny = new destinyApi({
    key: 'ba52571b22ec4bf48c7779794124910e'
});

// // Use this code snippet in your app.
// // If you need more information about configurations or implementing the sample code, visit the AWS docs:
// // https://aws.amazon.com/developers/getting-started/nodejs/

// // Load the AWS SDK
// var AWS = require('aws-sdk'),
//     region = "us-east-1",
//     secretName = "arc-buddy-api-key",
//     secret,
//     decodedBinarySecret;

// // Create a Secrets Manager client
// var client = new AWS.SecretsManager({
//     region: region
// });

// // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// // We rethrow the exception by default.

// client.getSecretValue({SecretId: secretName}, function(err, data) {
//     if (err) {
//         if (err.code === 'DecryptionFailureException')
//             // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
//             // Deal with the exception here, and/or rethrow at your discretion.
//             throw err;
//         else if (err.code === 'InternalServiceErrorException')
//             // An error occurred on the server side.
//             // Deal with the exception here, and/or rethrow at your discretion.
//             throw err;
//         else if (err.code === 'InvalidParameterException')
//             // You provided an invalid value for a parameter.
//             // Deal with the exception here, and/or rethrow at your discretion.
//             throw err;
//         else if (err.code === 'InvalidRequestException')
//             // You provided a parameter value that is not valid for the current state of the resource.
//             // Deal with the exception here, and/or rethrow at your discretion.
//             throw err;
//         else if (err.code === 'ResourceNotFoundException')
//             // We can't find the resource that you asked for.
//             // Deal with the exception here, and/or rethrow at your discretion.
//             throw err;
//     }
//     else {
//         // Decrypts secret using the associated KMS CMK.
//         // Depending on whether the secret is a string or binary, one of these fields will be populated.
//         if ('SecretString' in data) {
//             secret = data.SecretString;
//         } else {
//             let buff = new Buffer(data.SecretBinary, 'base64');
//             decodedBinarySecret = buff.toString('ascii');
//         }
//     }
    
//     // Your code goes here. 
// });

app.get("/api/players/:name/:id", async (req, res) => {
    const name = req.params.name;
    const id = req.params.id;

    const bungieName = name + "#" + id;

    destiny.searchDestinyPlayer(-1, bungieName)
    .then(response => {
        const data = response.Response[0];
        console.log(data);

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