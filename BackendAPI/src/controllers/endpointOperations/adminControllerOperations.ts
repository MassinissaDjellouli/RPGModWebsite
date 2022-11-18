import {Request, Response} from "express"
import {handleError, validateAdminAfterDB, validateAdminBeforeDB} from '../../utils/apiUtil';
import doDBOperation from "../../database/mongodb";
import {generateToken} from "../../security/tokenUtils";
import {IUser} from "../../models/user";
import {IAPIError} from "../../models/error";

export const adminLogin = async (req: Request, res: Response) => {
    if (validateAdminBeforeDB(req.body, res)) return;
    const response = await doDBOperation<IUser>("getAdmin", req.body);
    if (handleError(response, res)) return;
    const user: IUser | undefined = response as IUser | undefined;
    if (await validateAdminAfterDB(user, req.body, res)) return;
    res.status(201).json(generateToken(user as IUser));
}

export const getAdmin = async (req: Request, res: Response) => {
    const response = await doDBOperation<IUser>("getAdmin", req.body.user);
    if (handleError(response, res)) return;
    if (response == null) {
        res.status(404).json({err: "Admin not found"} as IAPIError);
        return;
    }
    res.status(200).json(response);
}
export const uploadNewModVersion = async (req: Request, res: Response) => {

}