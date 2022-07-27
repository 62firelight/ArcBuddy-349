const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    iconPath: String,
    displayName: String,
    membershipType: String,
    membershipId: String,

    dateCreated: Date,

    characters: [{
        characterId: String,

        race: String,
        class: String,
        light: String,
        emblem: String,

        mergedStats: Object,
        pveStats: Object,
        pvpStats: Object
    }],
    mergedStats: Object,
    pveStats: Object,
    pvpStats: Object
});

module.exports = mongoose.model('Profile', profileSchema);