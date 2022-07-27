module.exports = (app) => {
    const profiles = require('../controllers/profile.controller.js');

    // Create a new Profile
    app.post('/api/players/stats', profiles.create);

    // Retrieve all Profiles
    app.get('/api/players/stats', profiles.findAll);

    // Retrieve a single Profile with displayName
    app.get('/api/players/:name', profiles.findOne);

    // Delete a Profile with displayName
    app.delete('/api/players/:name', profiles.delete);
}