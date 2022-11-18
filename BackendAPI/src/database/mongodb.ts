import {MongoClient, MongoClientOptions, ObjectId, ServerApiVersion} from "mongodb";
import {IUser} from '../models/user';
import {IAPIError, isApiError} from '../models/error';
import {IUserStats} from '../models/userStats';
import {IConfirmationCode} from '../models/confirmationCode';
import UUID from 'uuid';
import bcrypt from "bcrypt";
import {IModVersions} from "../models/modVersions";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@rpgmoddb.kn2lpmy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
        pkFactory: {createPk: () => new ObjectId()}
    } as MongoClientOptions);

const DB_NAME = process.env.DB_NAME;
const db = client.db(DB_NAME);
const users = db.collection("users");
const userStats = db.collection("usersStats");
const confirmationCodes = db.collection("confirmationCodes");
const admins = db.collection("admins");
const modVersions = db.collection("modVersions");
export const init = async () => {

    await users.createIndex({username: 1}, {unique: true});
    await users.createIndex({email: 1}, {unique: true});
    await admins.createIndex({username: 1}, {unique: true});
    await userStats.createIndex({userId: 1}, {unique: true});
    await confirmationCodes.createIndex({code: 1}, {unique: true});
    await confirmationCodes.createIndex({userId: 1}, {unique: true});
    await modVersions.createIndex({version: 1}, {unique: true});

    console.log("Database initialized");
}


const doDBOperation = async <ExpectedReturn>(operation: string, data?: any): Promise<ExpectedReturn | IAPIError | undefined> => {
    try {
        switch (operation) {
            case "createUser":
                return await transaction<IUser>(createUser, data);
            case "getUser":
                return await transaction<any>(getUser, data);
            case "getAdmin":
                return await transaction<any>(getAdmin, data);
            case "getUserStats":
                return await transaction<ObjectId>(getUserStats, data);
            case "uploadUserStats":
                return await transaction<ObjectId>(uploadUserStats, data);
            case "addConfirmationCode":
                return await transaction<IConfirmationCode>(addConfirmationCode, data);
            case "confirmEmail":
                return await transaction<string>(confirmEmail, data);
            case "getCode":
                return await transaction<string>(getCode, data);
            case "isExpired":
                return await transaction<string>(isExpired, data);
            case "deleteCode":
                return await transaction(deleteCode, data)
            case "getModVersions":
                return await transaction(getModVersions)
            case "getModVersionsPerUpdate":
                return await transaction<string>(getModVersionsPerUpdate, data)
        }
    } catch (err) {
        return {err: "unknownError"} as IAPIError;
    }
}
const createUser = async (user: IUser) => {
    let res: ObjectId | undefined | IAPIError;
    delete user.id;
    await users.insertOne(user)
        .then((result) => res = result.insertedId)
        .catch((err) => {
            err.code == 11000 ? res = {err: "usernameOrEmailAlreadyExists"} as IAPIError : res = undefined
        });
    return res;
}

const getUser = async (body: any) => {
    if (!("username" in body || "email" in body)) {
        return undefined;
    }

    if (body.username != undefined) {
        return users.findOne({username: body.username});
    }
    if (body.email != undefined) {
        return users.findOne({email: body.email});
    }
    return {err: "emptyFields"} as IAPIError;
}
const getAdmin = async (body: any) => {
    if (body.username == undefined) {
        return undefined;
    }
    if (body.password == undefined) {
        return undefined;
    }
    return await admins.findOne({username: body.username});

}
const transaction = async <DataType>(callback: Function, data?: DataType): Promise<any | IAPIError | void> => {
    const session = client.startSession();
    try {
        let result;
        session.startTransaction();
        if (data != undefined) {
            result = await callback(data);
        } else {
            result = await callback();
        }
        if (result != undefined || result != null) {
            const toReturn = isApiError(result) ? result as IAPIError : result
            await session.commitTransaction();
            return toReturn;
        }
        await session.commitTransaction();
        console.log("Transaction committed");
    } catch (err) {
        console.log(err)
        await session.abortTransaction();
        return {err: "transactionAborted"} as IAPIError;

    } finally {
        await session.endSession();
    }

}

const getUserStats = async (id: ObjectId) => {
    return users.findOne({userId: id});
}

const uploadUserStats = async (stats: IUserStats) => {
    delete stats.id;
    const userStats = await users.findOne({userId: stats.userId})
    if (userStats == null) {
        await users.insertOne(stats)
        return;
    }
    await users.updateOne({userId: stats.userId}, {$set: stats});
}

const addConfirmationCode = async (code: IConfirmationCode) => {
    let res: string | IAPIError = "";
    let wrongCode = true;
    while (wrongCode) {
        await users.insertOne(code)
            .then((_) => {
                res = code.code;
                wrongCode = false;
            })
            .catch((err) => {
                err.code == 11000 ? wrongCode = true : res = {err: "unknownError"} as IAPIError;
                code.code = UUID.v4().toString();
            });
    }
    return res;
}

const confirmEmail = async (codeAndUser: { code: string, user: IUser }) => {
    const confirmationCode = await confirmationCodes.findOne({code: codeAndUser.code});
    if (codeAndUser.user.confirmedEmail) {
        return {err: "alreadyConfirmed"} as IAPIError;
    }
    if (confirmationCode == null) {
        return {err: "wrongCode"} as IAPIError;
    }
    if (confirmationCode.expirationDate < new Date()) {
        return {err: "expired"} as IAPIError;
    }
    const dbuser = await users.findOne({id: confirmationCode.userId});
    if (dbuser != null && !await bcrypt.compare(codeAndUser.user.password, dbuser.password)) {
        return {err: "wrongUser"} as IAPIError;
    }
    await users.findOneAndUpdate({_id: new ObjectId(confirmationCode.userId)}, {$set: {confirmedEmail: true}})
    await confirmationCodes.findOneAndDelete({code: codeAndUser.code});
}
const getCode = async (userId: string) => {
    const code = await confirmationCodes.findOne({userId: userId});
    if (code == null) {
        return {err: "noUser"} as IAPIError;
    }
    return code.code;
}

const isExpired = async (code: string) => {
    const confirmationCode = await confirmationCodes.findOne({code: code});
    if (confirmationCode == null) {
        return false;
    }
    if (confirmationCode.endTime < new Date()) {
        return true;
    }
    return false;
}

const deleteCode = async (code: string) => {
    await confirmationCodes.findOneAndDelete({code: code});
}
const getModVersions = async (): Promise<IModVersions[]> => {
    return await modVersions.find().map(
        doc => {
            const toReturn: IModVersions = {
                version: doc.version,
                minecraftVersion: doc.minecraftVersion,
                forgeVersion: doc.forgeVersion,
                uploadDate: doc.uploadDate,
                downloadCount: doc.downloadCount
            }
            return toReturn;
        }).toArray() as IModVersions[];

}
const getModVersionsPerUpdate = async (update: string): Promise<IModVersions[]> => {
    return (await modVersions.find()
        .map(
            doc => {
                const toReturn: IModVersions = {
                    version: doc.version,
                    minecraftVersion: doc.minecraftVersion,
                    forgeVersion: doc.forgeVersion,
                    uploadDate: doc.uploadDate,
                    downloadCount: doc.downloadCount
                }
                return toReturn;
            }).toArray()).filter((doc: IModVersions) => {
        return doc.minecraftVersion == update
    }) as IModVersions[];

}
export default doDBOperation;