import validate from "../utils/validationUtil";
import {Express} from 'express';
import {
    adminLogin,
    deleteModVersion,
    getAdmin,
    uploadNewModVersion
} from "./endpointOperations/adminControllerOperations";
import {authenticateToken} from "../security/tokenUtils";

const adminController = async (app: Express) => {
    app.post('/api/adminLogin', validate, adminLogin);
    app.get('/api/getAdmin', authenticateToken, getAdmin);
    app.post('/api/uploadNewModVersion', authenticateToken, uploadNewModVersion);
    app.delete('/api/deleteModVersion/:version', authenticateToken, deleteModVersion);

}
export default adminController;