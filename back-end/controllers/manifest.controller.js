const server = require('../server.js');
// const destinyApi = require('node-destiny-2');
// const QuriaAPI = require('quria').Quria;

exports.selectFromDefinition = (req, res) => {
    const db = server.getDb();
    if (db === undefined) {
        res.status(500).send('Manifest was not loaded properly!');
        return;
    }

    const name = req.params.name;
    const hash = req.params.hash;

    const id = `${server.convertHash(hash)}`;

    let definition = undefined;
    db.get(`SELECT * FROM Destiny${name}Definition WHERE id = $id`, {
        $id: id
    }, function (err, row) {
        if (err != null || row === undefined) {
            res.status(404).send('Could not find definition.');
            return;
        }
        
        definition = JSON.parse(row.json);
        if (definition === undefined) {
            res.status(404).send('Could not find definition.');
            return;
        }

        res.status(200).send(definition);
    });

};

exports.selectListFromDefinition = (req, res) => {
    const db = server.getDb();
    if (db === undefined) {
        res.status(500).send('Manifest was not loaded properly!');
        return;
    }

    const name = req.params.name;

    const hashes = req.body.hashes;

    if (hashes === undefined) {
        res.status(404).send('Invalid request body.');
        return;
    }

    // convert hashes
    let convertedHashes = [];
    for (let hash of hashes) {
        const convertedHash = server.convertHash(hash);
        convertedHashes.push(convertedHash.toString());
    }

    // console.log(convertedHashes.toString());
    let definitions = [];
    db.each(`SELECT * FROM Destiny${name}Definition WHERE id IN (${convertedHashes.toString()})`, function (err, row) {
        if (err != null || row === undefined) {
            res.status(404).send('Could not find definitions.');
            return;
        }
        
        const definition = JSON.parse(row.json);  
        if (definition === undefined) {
            res.status(404).send('Could not find definitions.');
            return;
        }

        // const definition = {
        //     name: vendorDefinition.displayProperties.name,
        //     hash: vendorDefinition.hash,
        //     icon: `https://www.bungie.net${vendorDefinition.displayProperties.icon}`
        // };

        definitions.push(definition);
    }, function () {
        res.status(200).send(definitions);
    });

    
};