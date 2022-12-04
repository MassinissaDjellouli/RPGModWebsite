import {authenticateToken} from '../security/securityUtils'
import {Express} from 'express';
import {
    confirmEmail,
    getModDownload,
    getModVersions,
    getModVersionsPerUpdate,
    getStats,
    getStatsById,
    getUser,
    inscription,
    isLinked,
    linkWorld,
    login,
    newConfirmationEmail,
    uploadStats
} from './endpointOperations/rootControllerOperations';
import validate from '../utils/validationUtil';

const rootController = async (app: Express) => {
    app.post('/api/inscription', validate, inscription);
    app.post('/api/login', validate, login);
    app.get('/api/stats', authenticateToken, getStats);
    app.get('/api/stats/:worldId', authenticateToken, getStatsById);
    app.get('/api/isLinked/:code', isLinked);
    app.post('/api/linkWorld/:code', authenticateToken, linkWorld);
    app.get('/api/getUser', authenticateToken, getUser);
    app.get('/api/getModVersions', getModVersions);
    app.get('/api/getModVersions/:mcversion', getModVersionsPerUpdate);
    app.get('/api/getModDL/:version', getModDownload);
    app.post('/api/uploadStats', uploadStats);
    app.put('/api/confirmEmail/:code', validate, confirmEmail);
    app.post('/api/newConfirmationEmail', validate, newConfirmationEmail);
}
export default rootController;


