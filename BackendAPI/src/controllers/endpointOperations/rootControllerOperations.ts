import {sendConfirmationEmail, sendNewConfirmationEmail} from '../../utils/emailUtil';
import {Request, Response} from 'express';
import {createUser} from '../../utils/createInterfaceUtil';
import doDBOperation from '../../database/mongodb';
import {IUser} from '../../models/user';
import {handleError, validateUserAfterDB, validateUserBeforeDB} from '../../utils/apiUtil';
import {ObjectId} from 'mongodb';
import {generateToken} from '../../security/tokenUtils';
import {IUserStats} from '../../models/userStats';
import {IAPIError, isApiError} from "../../models/error";
import {IModVersions} from "../../models/modVersions";


export const inscription = async (req: Request, res: Response) => {
    const body = req.body;
    const user: IUser = await createUser(body)
    const response = await doDBOperation<ObjectId>("createUser", user);
    if (handleError(response, res)) return;
    if (!await sendConfirmationEmail(user.email, (response as ObjectId).toString())) {
        res.status(500).json({err: "emailNotSent"});
        return;
    }
    res.sendStatus(201);
}

export const login = async (req: Request, res: Response) => {
    if (validateUserBeforeDB(req.body, res)) return;
    const response = await doDBOperation<IUser>("getUser", req.body);
    if (handleError(response, res)) return;
    const user: IUser | undefined = response as IUser | undefined;
    if (await validateUserAfterDB(user, req.body, res)) return;
    res.json(generateToken(user as IUser));
}

export const getStats = async (req: Request, res: Response) => {
    const user: IUser = req.body.user;
    const response = await doDBOperation<IUserStats>("getUserStats", user.id);
    if (response == undefined) {
        res.sendStatus(404);
        return;
    }
    const stats: IUserStats = response as IUserStats;
    res.status(200).json(stats);
}
export const getUser = async (req: Request, res: Response) => {
    const user: IUser = req.body.user;
    const response = await doDBOperation<IUser>("getUser", user);
    if (response == undefined) {
        res.status(404).json({err: "userNotFound"});
        console.log("User not found");
        return;
    }
    if (isApiError(response)) {
        res.status(400).json(response);
        return;
    }
    const userToReturn: IUser = response as IUser;
    res.status(200).json(userToReturn);
}
export const uploadStats = async (req: Request, res: Response) => {
    const user: IUser = req.body.user;
    const response = await doDBOperation<IUserStats>("uploadUserStats", {userId: user.id} as IUserStats);
    const stats: IUserStats = response as IUserStats;
    res.status(200).json(stats);
}

export const confirmEmail = async (req: Request, res: Response) => {
    const resp = await doDBOperation<IUser>("getUser", req.body);
    if (resp == undefined) {
        res.sendStatus(404);
        return;
    }
    if (handleError(resp, res)) {
        return;
    }
    const user: IUser = resp as IUser;
    const response = await doDBOperation<string>("confirmEmail", {code: req.params.code, user: user});
    if (handleError(response, res)) return;
    res.sendStatus(200);
}

export const newConfirmationEmail = async (req: Request, res: Response) => {
    const result = await sendNewConfirmationEmail(req.body.email)
    if (result != undefined) {
        const status = (result as IAPIError).status;
        res.status(status != undefined ? status : 500).json(result as IAPIError);
        return;
    }
    res.sendStatus(200);
}
export const getModVersions = async (req: Request, res: Response) => {
    const resp = await doDBOperation<IModVersions[]>("getModVersions");
    res.status(200).json(resp);
}
export const getModVersionsPerUpdate = async (req: Request, res: Response) => {
    const resp = await doDBOperation<IModVersions[]>("getModVersionsPerUpdate", req.params.mcversion);
    res.status(200).json(resp);
}
export const getModDownload = (req: Request, res: Response) => {
    res.sendStatus(200)
}