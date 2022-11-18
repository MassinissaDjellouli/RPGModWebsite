import validate from "../utils/validationUtil";
import {Express} from 'express';
import {adminLogin, getAdmin, uploadNewModVersion} from "./endpointOperations/adminControllerOperations";
import {authenticateToken} from "../security/tokenUtils";

const adminController = async (app: Express) => {
    app.post('/api/adminLogin', validate, adminLogin);
    app.get('/api/getAdmin', authenticateToken, getAdmin);
    app.post('/api/uploadNewModVersion', validate, uploadNewModVersion);
}
export default adminController;