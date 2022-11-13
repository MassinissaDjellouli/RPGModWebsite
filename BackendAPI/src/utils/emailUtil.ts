import nodemailer from 'nodemailer';
import UUID from 'bson';
import doDBOperation from '../database/mongodb';
import { ConfirmationCode } from '../models/confirmationCode';
import { APIError, isApiError } from '../models/error';
import { randomUUID } from 'crypto';
const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PWD
    }
});
export const sendConfirmationEmail = async (email:string):Promise<boolean> => {
    const confirmationCode:string | undefined = await generateConfirmationCode();
    if(confirmationCode === undefined){
        return false;
    }
    await transport.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Confirmez votre adresse email",
        html: `<h1>Confirmez votre adresse email avant 24h.</h1>
        <a href=http://${process.env.API_ADDRESS}/api/confirmEmail/${confirmationCode!}> Cliquez ici</a>`
    }).catch((_) => {
        return false;
    });
    return true;
}
const generateConfirmationCode = async ():Promise<string | undefined> => {
    const code:string = randomUUID();
    const result = await doDBOperation<string | APIError>("addConfirmationCode", {
        time:new Date(),
        code:code, 
        endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
    } as ConfirmationCode) as string;
    if(isApiError(result)){
        return undefined
    }
    return code;
}