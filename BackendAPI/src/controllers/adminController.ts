import validate from "../utils/validationUtil";
import {Express} from 'express';
import {
    adminLogin,
    deleteModVersion,
    getAdmin,
    uploadNewModVersion
} from "./endpointOperations/adminControllerOperations";
import {authenticateToken, authorizeAdmin} from "../security/securityUtils";

const adminController = async (app: Express) => {
    app.post('/api/adminLogin', validate, adminLogin);
    app.get('/api/getAdmin', authenticateToken, authorizeAdmin, getAdmin);
    app.post('/api/uploadNewModVersion', authenticateToken, authorizeAdmin, uploadNewModVersion);
    app.delete('/api/deleteModVersion/:version', authenticateToken, authorizeAdmin, deleteModVersion);

}
export default adminController;