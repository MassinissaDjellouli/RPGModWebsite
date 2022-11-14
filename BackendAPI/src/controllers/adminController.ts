import validate from "../utils/validationUtil";
import { Express } from 'express';
import { adminLogin, uploadNewModVersion } from "./endpointOperations/adminControllerOperations";

const adminController = async (app: Express) => {
    app.post('/api/adminLogin',validate, adminLogin);
    app.post('/api/uploadNewModVersion',validate, uploadNewModVersion);
}
export default adminController;