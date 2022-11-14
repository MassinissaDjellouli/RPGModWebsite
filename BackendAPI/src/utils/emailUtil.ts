import nodemailer from 'nodemailer';
import doDBOperation from '../database/mongodb';
import { IConfirmationCode } from '../models/confirmationCode';
import { IAPIError, isApiError } from '../models/error';
import { randomUUID } from 'crypto';
import { createUser } from './createInterfaceUtil';
const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PWD
    }
});
export const sendNewConfirmationEmail = async (email:string):Promise<boolean> => {
    
    const response = await doDBOperation<any>("getUser", {email:email})
    if(isApiError(response) || response == undefined){
        return false;
    }
    
    const userId = response._id!.toString();
    if(await confirmationCodeAlreadyExists(userId) && !await isExpired(userId)){
        return false;
    }
    if(await isExpired(userId)){
        await doDBOperation<string>("deleteExpiredCode",await getCode(userId));
    }
    return sendConfirmationEmail(email, userId);
}

export const sendConfirmationEmail = async (email:string,userId: string):Promise<boolean> => {
    if(email === undefined || userId === undefined){
        return false;
    }
    
    const confirmationCode:string | undefined = await generateConfirmationCode(userId);
    if(confirmationCode === undefined){
        return false;
    }
    await transport.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Confirmez votre adresse email",
        html: `<p>Confirmez votre adresse email avant 24h.</p>
        <a href=http://${process.env.API_ADDRESS}/api/confirmEmail/${confirmationCode!}> Cliquez ici</a>`
    }).catch((_) => {
        return false;
    });
    console.log(`http://${process.env.API_ADDRESS}/api/confirmEmail/${confirmationCode!}`);
    
    return true;
}
const generateConfirmationCode = async (id:string):Promise<string | undefined> => {
    const code:string = randomUUID();
    const result = await doDBOperation<string | IAPIError>("addConfirmationCode", {
        time:new Date(),
        code:code, 
        userId: id,
        endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
    } as IConfirmationCode) as string;
    if(isApiError(result)){
        return undefined
    }
    return code;
}

const confirmationCodeAlreadyExists = async (userId:string):Promise<boolean> => {
    const result = await doDBOperation<string>("getCode", userId);
    if(isApiError(result)){
        return false;
    }
    return true;
}

const getCode = async(userId:string):Promise<string> => {
    return await doDBOperation<string>("getCode", userId) as string;
}

const isExpired = async (userId:string):Promise<boolean> => {
    if(!await confirmationCodeAlreadyExists(userId)){
        return false;	
    }
    return await doDBOperation<boolean>("isExpired", await getCode(userId)) as boolean;
}