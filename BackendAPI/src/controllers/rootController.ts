import {authenticateToken} from '../security/tokenUtils'
import {Express} from 'express';
import {
    confirmEmail,
    getModDownload,
    getModVersions,
    getModVersionsPerUpdate,
    getStats,
    getUser,
    inscription,
    login,
    newConfirmationEmail,
    uploadStats
} from './endpointOperations/rootControllerOperations';
import validate from '../utils/validationUtil';

const rootController = async (app: Express) => {
    app.post('/api/inscription', validate, inscription);
    app.post('/api/login', validate, login);
    app.get('/api/stats', authenticateToken, getStats);
    app.get('/api/getUser', authenticateToken, getUser);
    app.get('/api/getModVersions', getModVersions);
    app.get('/api/getModVersions/:mcversion', getModVersionsPerUpdate);
    app.get('/api/getModDL/:version', getModDownload);
    app.post('/api/uploadStats', validate, authenticateToken, uploadStats);
    app.put('/api/confirmEmail/:code', validate, confirmEmail);
    app.post('/api/newConfirmationEmail', validate, newConfirmationEmail);
}
export default rootController;


