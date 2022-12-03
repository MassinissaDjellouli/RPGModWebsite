import {NextFunction, Request, Response} from 'express';

const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const validateAdmins = (username: string, password: string, res: Response) => {
    const ADMIN_USERNAMES = process.env.ADMIN_USERNAMES
    if (ADMIN_USERNAMES == undefined) {
        return true;
    }
    const admins = ADMIN_USERNAMES.split(',');
    if (admins.includes(username) && password.length < 36) {
        res.status(400).send("Admin Password is too short");
        return true;
    }
    return false;
}
const validate = (req: Request, res: Response, next: NextFunction) => {
    const {
        username,
        password,
        email
    }: {
        username: string,
        password: string,
        email: string
    } = req.body;
    console.log(req.body);
    if (email != undefined && !validateEmail(email)) {
        res.status(400).send("Invalid email");
        return;
    }
    if (username != undefined && username.length < 3) {
        res.status(400).send("Username is too short");
        return;
    }
    if (password != undefined && password.length < 8) {
        res.status(400).send("Password is too short");
        return;
    }
    if (validateAdmins(username, password, res)) return;
    next();
}
export default validate;