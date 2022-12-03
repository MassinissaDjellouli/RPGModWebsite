import {Response} from "express";
import {IAPIError, isApiError} from "../models/error";
import {IUser} from "../models/user";
import bcrypt from 'bcrypt';

export const handleError = (response: any, res: Response): boolean => {
    try {
        if ((response != undefined || response != null) && isApiError(response)) {
            const error: IAPIError = response as IAPIError;
            switch (error.err) {
                case "usernameOrEmailAlreadyExists":
                    res.status(422).json(error);
                    return true;
                case "emptyFields" :
                case "wrongUser":
                    res.status(400).json(error);
                    return true;
                case "wrongCode":
                case "userNotFound":
                    res.status(404).json(error);
                    return true;
                case "expired":
                case "alreadyConfirmed":
                    res.status(403).json(error);
                    return true;
                default:
                    res.sendStatus(500);
                    return true;
            }
        }
        return false;
    } catch (err) {
        res.sendStatus(500);
        return true;
    }
}

export const validateUserAfterDB = async (user: IUser | undefined, body: any, res: Response): Promise<boolean> => {
    if (user == undefined) {
        if (body.username != undefined) {
            res.status(404).json({err: "wrongUsername"});
            return true;
        }
        res.status(404).json({err: "wrongEmail"});
        return true;
    }
    if (!user.confirmedEmail) {
        res.status(403).json({err: "unconfirmedEmail"});
        return true;
    }
    if (!await bcrypt.compare(body.password, user.password)) {
        res.status(403).json({err: "password"});
        return true;
    }
    return false;
}
export const validateAdminAfterDB = async (user: IUser | undefined, body: any, res: Response): Promise<boolean> => {
    if (user == undefined) {
        res.status(404).json({err: "wrongUsername"});
        return true;
    }
    if (!await bcrypt.compare(body.password, user.password)) {
        res.status(403).json({err: "password"});
        return true;
    }
    return false;
}
export const validateUserBeforeDB = (body: any, res: Response): boolean => {
    if ((body.username == undefined && body.email == undefined) || body.password == undefined) {
        if (body.password == undefined) {
            res.status(400).json({err: "noPWD"});
            return true;
        }
        res.status(400).json({err: "noUsernameOrEmail"});
        return true;
    }
    return false;
}
export const validateAdminBeforeDB = (body: any, res: Response): boolean => {
    if (body.username == undefined || body.password == undefined) {
        if (body.password == undefined) {
            res.status(400).json({err: "noPWD"});
            return true;
        }
        res.status(400).json({err: "noUsername"});
        return true;
    }
    return false;
}