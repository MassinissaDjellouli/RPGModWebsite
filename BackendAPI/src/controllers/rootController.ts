import { authenticateToken, generateToken } from '../security/tokenUtils'
import { Request, Response, Express } from 'express';
import doDBOperation from '../database/mongodb';
import { User } from '../models/user';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { sendConfirmationEmail } from '../utils/emailUtil';
import { isApiError, APIError } from '../models/error';
import { UserStats } from '../models/userStats';

const controller = async (app: Express) => {

    app.post('/api/inscription', async (req: Request, res: Response) => {
        const body = req.body;
        const user: User = await createUser(body)
        const response = await doDBOperation<ObjectId>("createUser", user);
        if (handleError(response,res)) return;
        if (!sendConfirmationEmail(user.email)) {
            res.status(500).json({ err: "emailNotSent" });
            return;
        }
        res.sendStatus(201);
    });

    app.post('/api/login', async (req: Request, res: Response) => {
        if(validateUserBeforeDB(req.body, res)) return;
        const response = await doDBOperation<User>("getUser", req.body);
        if(handleError(response,res)) return;
        const user: User | undefined = response as User | undefined;
        if(await validateUserAfterDB(user,req.body,res)) return;
        res.json(generateToken(user as User));
    });

    app.get('/api/stats', authenticateToken, async (req: Request, res: Response) => {
        const user:User = req.body.user;
        const response = await doDBOperation<UserStats>("getUserStats", user.id);
        if(response == undefined) {
            res.sendStatus(404);
            return;
        }
        const stats:UserStats = response as UserStats;
        res.status(200).json(stats);
    });

    app.post('/api/uploadStats', authenticateToken, async (req: Request, res: Response) => {
        const user:User = req.body.user;
        const response = await doDBOperation<UserStats>("uploadUserStats", {userId:user.id} as UserStats);
        const stats:UserStats = response as UserStats;
        res.status(200).json(stats);
    });

    app.put('/api/confirmEmail/:code', (req: Request, res: Response) => {
    });
    app.put('/api/link', authenticateToken, (req: Request, res: Response) => {
    });
}

const handleError = (response: any, res: Response): boolean => {
    try{

        if (response != undefined && isApiError(response)) {
            const error: APIError = response as APIError;
            switch (error.err) {
                case "usernameOrEmailAlreadyExists": res.status(422).json(error); return true;
                case "emptyFields": res.status(400).json(error); return true;
                default: res.sendStatus(500); return true;
            }
        }
        return false;
    }catch(err){
        console.log(err);
        res.sendStatus(500);
        return true;
    }
}

const createUser = async (body:any) => {
    return{
        id: undefined,
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        email: body.email,
        confirmedEmail: false,
        linked: false,
        creationDate: new Date().toLocaleDateString(),
    }
}

const validateUserAfterDB = async (user:User | undefined, body:any, res: Response):Promise<boolean> => {
    if (user == undefined) {
        if (body.username != undefined) {
            res.status(404).json({ err: "wrongUsername" });
            return true;
        }
        res.status(404).json({ err: "wrongEmail" });
        return true;
    }
    if (!user.confirmedEmail) {
        res.status(403).json({ err: "unconfirmedEmail" });
        return true;
    }
    if (!await bcrypt.compare(body.password, user.password)) {
        res.status(403).json({ err: "password" });
        return true;
    }
    return false;
}
const validateUserBeforeDB = (body:any, res: Response):boolean => {
    if ((body.username == undefined && body.email == undefined) || body.password == undefined) {
        console.log(body)
        if (body.password == undefined) {
            res.status(400).json({ err: "noPWD" });
            return true;
        }
        res.status(400).json({ err: "noUsernameOrEmail" });
        return true;
    }
    return false;
}
export default controller;


