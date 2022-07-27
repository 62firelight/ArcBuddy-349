const Profile = require('../models/profile.model.js');

exports.create = (req, res) => {
    try {
        // if (noDb == true) {
        //     snapshots.push(req.body);
        //     console.log("Successfully added " + req.body.displayName);
        //     res.status(201).send("");
        // }

        const profile = new Profile(req.body);
        profile.save()
            .then(() => {
                console.log("Successfully added " + req.body.displayName);
                res.status(201).send("");
            }).catch((error) => {
                throw (error);
            });

    } catch (error) {
        console.log(error);

        res.status(404).send("Couldn't create snapshot for specified Destiny player");
    }
};

exports.findAll = (req, res) => {
    try {
        // Retrieve snapshots of profiles from local storage (WARNING: not persistent)
        // if (noDb == true) {
        //     const response = snapshots;
        //     res.status(200).send(response);
        // }
        Profile.find()
            .then((response) => {
                res.status(200).send(response);
            })
            .catch((error) => {
                throw (error);
            });

    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshots");
    }
};

exports.findOne = (req, res) => {
    try {
        var profile = undefined;

        // Search through snapshots array for the requested display name (WARNING: slow for large arrays)
        // if (noDb == true) {
        //     profile = snapshots.find(element =>
        //         element.displayName.localeCompare(req.params.name) == 0
        //     );

        //     if (profile != undefined) {
        //         res.status(200).send(profile);
        //     }
        //     else {
        //         throw ("No profile with that display name was found!");
        //     }
        // }
        Profile.find({
            displayName: req.params.name
        }).then((profile) => {
            res.status(200).send(profile);
        }).catch((error) => {
            throw (error);
        });

    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshot for specified Destiny player");
    }
}

exports.delete = (req, res) => {
    try {
        // var origSnapshotLength = snapshots.length;

        // Delete specific snapshot of profile from array
        // if (noDb == true) {
        //     snapshots = snapshots.filter(element =>
        //         element.displayName.localeCompare(req.params.name) != 0
        //     );

        //     if (snapshots.length < origSnapshotLength) console.log("Successfully deleted " + req.params.name);

        //     res.status(204).send();
        // } else {
        Profile.deleteMany({
            displayName: req.params.name
        }).then((profile) => {
            console.log("Successfully deleted " + req.params.name);
            res.status(204).send();
        }).catch((error) => {
            throw (error);
        });


    } catch (error) {
        console.log(error);

        res.status(404).send("Can't find snapshot for specified Destiny player");
    }
}