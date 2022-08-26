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