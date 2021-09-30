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

        console.log(membershipType, membershipId);
        console.log('\n\n');

        res.status(200).send(data);
    })
    .catch(err => {
        console.error(`searchPlayer Error: ${err}`);
        
        res.status(404).send('Could not find specified Destiny player');
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