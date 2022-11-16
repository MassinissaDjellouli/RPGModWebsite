import { authenticateToken } from '../security/tokenUtils'
import { Express } from 'express';
import { inscription, login, getStats, uploadStats, confirmEmail, newConfirmationEmail, getModVersions, getModDownload, getUser } from './endpointOperations/rootControllerOperations';
import validate from '../utils/validationUtil';
const rootController = async (app: Express) => {
    app.post('/api/inscription',validate, inscription);
    app.post('/api/login',validate, login);
    app.get('/api/stats', authenticateToken, getStats);
    app.get('/api/getUser', authenticateToken, getUser);
    app.get('/api/getModVersions', authenticateToken, getModVersions);
    app.get('/api/getModDL/:version', authenticateToken, getModDownload);
    app.post('/api/uploadStats',validate, authenticateToken, uploadStats);
    app.put('/api/confirmEmail/:code',validate,confirmEmail);
    app.post('/api/newConfirmationEmail',authenticateToken,validate, newConfirmationEmail);
}
export default rootController;


