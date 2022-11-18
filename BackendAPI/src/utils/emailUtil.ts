import nodemailer from 'nodemailer';
import doDBOperation from '../database/mongodb';
import {IConfirmationCode} from '../models/confirmationCode';
import {IAPIError, isApiError} from '../models/error';
import {randomUUID} from 'crypto';

const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PWD
    }
});
export const sendNewConfirmationEmail = async (email: string): Promise<void | IAPIError> => {
    const response = await doDBOperation<any>("getUser", {email: email})
    if (isApiError(response) || response == undefined) {
        return (response == undefined ? {err: "emailNotFound", status: 404} : response) as IAPIError;
    }
    if (response.confirmedEmail) {
        return {err: "alreadyConfirmed", status: 401} as IAPIError;
    }
    const userId = response._id!.toString();
    if (await confirmationCodeAlreadyExists(userId) || await isExpired(userId)) {
        await doDBOperation<string>("deleteCode", await getCode(userId));
    }
    if (await sendConfirmationEmail(email, userId)) {
        return
    }
    return {err: "emailNotSent"} as IAPIError;
}

export const sendConfirmationEmail = async (email: string, userId: string): Promise<boolean> => {
    if (email === undefined || userId === undefined) {
        return false;
    }

    const confirmationCode: string | undefined = await generateConfirmationCode(userId);
    if (confirmationCode === undefined) {
        return false;
    }
    await transport.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Confirmez votre adresse email",
        html: `<p>Confirmez votre adresse email avant 24h.</p>
        <a href=${process.env.EMAIL_LINK}> Cliquez ici</a><p>et entrez le code suivant ainsi que vos identifiants</p> ${confirmationCode!}  `
    }).catch((_) => {
        return false;
    });

    return true;
}
const generateConfirmationCode = async (id: string): Promise<string | undefined> => {
    const code: string = randomUUID();
    const result = await doDBOperation<string | IAPIError>("addConfirmationCode", {
        time: new Date(),
        code: code,
        userId: id,
        endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
    } as IConfirmationCode) as string;
    if (isApiError(result)) {
        return undefined
    }
    return code;
}

const confirmationCodeAlreadyExists = async (userId: string): Promise<boolean> => {
    const result = await doDBOperation<string>("getCode", userId);
    if (isApiError(result)) {
        return false;
    }
    return true;
}

const getCode = async (userId: string): Promise<string> => {
    return await doDBOperation<string>("getCode", userId) as string;
}

const isExpired = async (userId: string): Promise<boolean> => {
    if (!await confirmationCodeAlreadyExists(userId)) {
        return false;
    }
    return await doDBOperation<boolean>("isExpired", await getCode(userId)) as boolean;
}