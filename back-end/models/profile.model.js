const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    _id: String,
    iconPath: String,
    displayName: String,
    membershipType: String,
    membershipId: String,

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
    pvpStats: Object,
    dateCreated: Date
}, { _id : false });

module.exports = mongoose.model('Profile', profileSchema);