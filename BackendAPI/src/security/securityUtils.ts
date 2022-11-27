import doDBOperation from "../database/mongodb";
import {NextFunction, Request, Response} from 'express';
import {IUser} from "../models/user";
import {createUserFromToken} from "../utils/createInterfaceUtil";
import {isApiError} from "../models/error";

export const jwt = require('jsonwebtoken');

const SECRET = process.env.TOKEN_SECRET;

if (SECRET == null || SECRET == undefined) {
    console.log("Token secret not set");
    process.exit(1);
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err: any, user: IUser) => {
        if (err) return res.sendStatus(403);
        req.body.user = createUserFromToken(user);
        next();
    });
}
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const response = await doDBOperation<any>("getAdmin", req.body.user);
    if (isApiError(response) || response == undefined) {
        res.sendStatus(403);
        return
    }
    next();
}
export const generateToken = (user: IUser) => {
    return jwt.sign(user, SECRET, {expiresIn: '30m'});
}