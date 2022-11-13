export const jwt = require('jsonwebtoken');
import { UUID } from "bson";
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

const SECRET = process.env.TOKEN_SECRET;

if(SECRET == null || SECRET == undefined) {
    console.log("Token secret not set");
    process.exit(1);
}
export const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    console.info("Authenticating token");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err:any, user:User) => {
        if (err) return res.sendStatus(403);
        req.body.user = createUserFromToken(user);
        next();
    });
    
}
const createUserFromToken = (user:any):User => {
    return {
        id: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        confirmedEmail: user.confirmedEmail,
        linked: user.linked,
        creationDate: user.creationDate,
    }
}
export const generateToken = (user:User) => {
    return jwt.sign(user, SECRET, {expiresIn: '30m'});
}