authTokens = require('../security/tokenUtils').authenticate;
generateToken = require('../security/tokenUtils').generateToken;

module.exports = getRequests = async (APP) => {
    APP.post('/api/inscription', authTokens, (req, res) => {
    });
    APP.get('/api/login', authTokens, (req, res) => {
    });
    APP.get('/api/stats/:id', authTokens, (req, res) => {
    });
    APP.put('/api/confirmEmail', authTokens, (req, res) => {
    });
    APP.put('/api/link', authTokens, (req, res) => {
    });
}