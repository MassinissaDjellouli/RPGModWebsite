import {Request, Response} from "express"
import {handleError, validateAdminAfterDB, validateAdminBeforeDB} from '../../utils/apiUtil';
import doDBOperation from "../../database/mongodb";
import {generateToken} from "../../security/tokenUtils";
import {IUser} from "../../models/user";

export const adminLogin = async (req: Request, res: Response) => {
    if (validateAdminBeforeDB(req.body, res)) return;
    const response = await doDBOperation<IUser>("getAdmin", req.body);
    if (handleError(response, res)) return;
    const user: IUser | undefined = response as IUser | undefined;
    console.log(response)
    if (await validateAdminAfterDB(user, req.body, res)) return;
    res.json(generateToken(user as IUser));
}

export const getAdmin = async (req: Request, res: Response) => {
    const response = await doDBOperation<IUser>("getAdmin", req.body);
    if (handleError(response, res)) return;
    res.json(response);
}
export const uploadNewModVersion = async (req: Request, res: Response) => {

}