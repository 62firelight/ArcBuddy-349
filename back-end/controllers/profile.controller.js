const Profile = require('../models/profile.model.js');
const server = require('../server.js');

let snapshots = [];

exports.create = (req, res) => {
    try {
        if (server.getNoDb() == true) {
            snapshots.push(req.body);
            console.log("Successfully added " + req.body.displayName);
            res.status(201).send("");
        } else {
            // manually set id to membership id
            req.body._id = req.body.membershipId;
            const profile = new Profile(req.body);
            profile.save()
                .then(() => {
                    console.log("Successfully added " + req.body.displayName);
                    res.status(201).send("");
                }).catch((error) => {
                    throw (error);
                });
        }
    } catch (error) {
        console.log(error);
        res.status(422).send('Failed to create profile for specified Destiny player.');
    }
};

exports.findAll = (req, res) => {
    try {
        if (server.getNoDb() == true) {
            const response = snapshots;
            res.status(200).send(response);
        } else {
            Profile.find()
                .then((response) => {
                    res.status(200).send(response);
                })
                .catch((error) => {
                    throw (error);
                });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send('Failed to retrieve profiles.');
    }
};

exports.findOne = (req, res) => {
    try {
        if (server.getNoDb() == true) {
            let profile = undefined;

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
            Profile.find({
                displayName: req.params.name
            }).then((profile) => {
                res.status(200).send(profile);
            }).catch((error) => {
                throw (error);
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send('Failed to retrieve profile for specified Destiny player.');
    }
}

exports.update = (req, res) => {
    try {
        if (server.getNoDb() == true) {
            let index = snapshots.findIndex(e => e.displayName.localeCompare(req.params.name) == 0);

            if (index != -1) {
                snapshots[index] = req.body;
            }
            console.log(`Successfully updated ${req.params.name}`);
            res.status(204).send("");
        } else {
            const newProfile = new Profile(req.body);
            Profile.replaceOne({
                displayName: req.params.name
            }, newProfile)
            .then(() => {
                console.log(`Successfully updated ${req.params.name}`);
                res.status(204).send("");
            }).catch((error) => {
                throw (error);
            });
            
        }
    } catch (error) {
        console.log(error);
        res.status(422).send("Failed to delete profile for specified Destiny player.");
    }
}

exports.delete = (req, res) => {
    try {
        if (server.getNoDb() == true) {
            const origSnapshotLength = snapshots.length;

            snapshots = snapshots.filter(element =>
                element.displayName.localeCompare(req.params.name) != 0
            );

            if (snapshots.length < origSnapshotLength) console.log(`Successfully deleted ${req.params.name}`);

            res.status(204).send();
        } else {
            Profile.deleteMany({
                displayName: req.params.name
            }).then((profile) => {
                console.log(`Successfully deleted ${req.params.name}`);
                res.status(204).send();
            }).catch((error) => {
                throw (error);
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send("Failed to delete profile for specified Destiny player.");
    }
}