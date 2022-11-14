import { authenticateToken } from '../security/tokenUtils'
import { Express } from 'express';
import { inscription, login, getStats, uploadStats, confirmEmail, newConfirmationEmail } from './endpointOperations/rootControllerOperations';
const rootController = async (app: Express) => {
    app.post('/api/inscription', inscription);
    app.post('/api/login', login);
    app.get('/api/stats', authenticateToken, getStats);
    app.post('/api/uploadStats', authenticateToken, uploadStats);
    app.put('/api/confirmEmail/:code',confirmEmail);
    app.post('/api/newConfirmationEmail', newConfirmationEmail);
}
export default rootController;


