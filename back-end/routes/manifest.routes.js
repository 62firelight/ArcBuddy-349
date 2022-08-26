module.exports = (app) => {
    const manifest = require('../controllers/manifest.controller.js');
    
    app.get('/api/manifest/:name/:hash', manifest.selectFromDefinition);

    app.post('/api/manifest/:name', manifest.selectListFromDefinition);
};