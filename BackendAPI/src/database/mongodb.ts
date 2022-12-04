import {MongoClient, MongoClientOptions, ObjectId, ServerApiVersion} from "mongodb";
import {IUser} from '../models/user';
import {IAPIError, isApiError} from '../models/error';
import {IUserStats} from '../models/userStats';
import {IConfirmationCode} from '../models/confirmationCode';
import UUID from 'uuid';
import bcrypt from "bcrypt";
import {IModVersions, INewModVersion} from "../models/modVersions";

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
const modVersionsFiles = db.collection("modVersionsFiles");
const worldCodes = db.collection("worldCodes");
export const init = async () => {

    await users.createIndex({username: 1}, {unique: true});
    await users.createIndex({email: 1}, {unique: true});
    await admins.createIndex({username: 1}, {unique: true});
    await confirmationCodes.createIndex({code: 1}, {unique: true});
    await confirmationCodes.createIndex({userId: 1}, {unique: true});
    await modVersions.createIndex({version: 1}, {unique: true});
    await modVersionsFiles.createIndex({version: 1}, {unique: true});
    await worldCodes.createIndex({code: 1}, {unique: true});
    console.log("Database initialized");
}


const getModFile = async (version: string) => {
    if (version == undefined) {
        return undefined;
    }
    const result = await modVersionsFiles.findOne({version: version});
    return result?.file as number[];
}
const getModVersion = async (version: string) => {
    if (version == undefined) {
        return undefined;
    }
    const result = await modVersions.findOne({version: version});
    if (result == null) {
        return undefined;
    }
    return {
        version: result.version,
        minecraftVersion: result.minecraftVersion,
        forgeVersion: result.forgeVersion,
        uploadDate: result.uploadDate,
        downloadCount: result.downloadCount,
    } as IModVersions;
}
const updateModVersion = async (version: IModVersions) => {
    console.log(version)
    if (version == undefined) {
        return undefined;
    }
    const res = await modVersions.findOneAndUpdate({version: version.version}, {$set: version});
    console.log(res)
}

const doDBOperation = async <ExpectedReturn>(operation: string, data?: any): Promise<ExpectedReturn | IAPIError | undefined> => {
    try {
        switch (operation) {
            case "createUser":
                return await transaction<IUser>(createUser, data);
            case "getUser":
                return await transaction<any>(getUser, data);
            case "getUserById":
                return await transaction<ObjectId>(getUserById, data);
            case "getAdmin":
                return await transaction<any>(getAdmin, data);
            case "getUserStats":
                return await transaction<ObjectId>(getUserStats, data);
            case "getUserStatsById":
                return await transaction<any>(getUserStatsById, data);
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
            case "addModVersion":
                return await transaction<INewModVersion>(addModVersion, data)
            case "getModVersion":
                return await transaction<string>(getModVersion, data)
            case "updateModVersion":
                return await transaction<IModVersions>(updateModVersion, data)
            case "deleteModVersion":
                return await transaction<string>(removeModVersion, data)
            case "getModDownload":
                return await transaction<string>(getModFile, data)
            case "getWorldCode":
                return await transaction<string>(getWorldCode, data)
            case "addWorldCode":
                return await transaction<{ code: string, userId: ObjectId }>(addWorldCode, data)
            default:
                return {err: "operationNotFound", status: 500} as IAPIError;
        }
    } catch (err) {
        return {err: "unknownError"} as IAPIError;
    }
}
const addWorldCode = async (code: { code: string, userId: ObjectId }) => {
    return worldCodes.insertOne(code);
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
const getUserById = async (id: string) => {
    return await users.findOne({_id: new ObjectId(id)});
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

const getUserStats = async (username: string) => {
    return userStats.find({username: username}).toArray();
}
const getUserStatsById = async (data: { username: string, worldId: string }) => {
    return userStats.find({username: data.username, worldId: data.worldId}).toArray();
}

const uploadUserStats = async (stats: IUserStats) => {
    delete stats.id;
    const user = await users.findOne({username: stats.username})
    if (user == null) {
        return {err: "userNotFound"} as IAPIError;
    }
    const worlds: Set<string> = new Set(user.linkedWorlds);
    worlds.add(stats.worldId);
    user.linkedWorlds = Array.from(worlds);
    await users.findOneAndUpdate({username: stats.username}, {$set: user});
    await userStats.insertOne({...stats, uploadTime: new Date()})
}

const addConfirmationCode = async (code: IConfirmationCode) => {
    let res: string | IAPIError = "";
    let wrongCode = true;
    while (wrongCode) {
        await confirmationCodes.insertOne(code)
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
const addModVersion = async (modVersion: INewModVersion) => {
    let res = await modVersions.insertOne({
        version: modVersion.version,
        minecraftVersion: modVersion.minecraftVersion,
        forgeVersion: modVersion.forgeVersion,
        uploadDate: modVersion.uploadDate,
        downloadCount: modVersion.downloadCount
    }).catch((err) => {
        return err.code == 11000 ? {
            status: 422,
            err: "versionAlreadyExists"
        } as IAPIError : {err: "Erreur inconnue"} as IAPIError
    });
    if (isApiError(res)) {
        return res
    }
    res = await modVersionsFiles.insertOne({
        version: modVersion.version,
        file: modVersion.file
    }).catch((err) => {
        return err.code == 11000 ? {
            status: 422,
            err: "versionAlreadyExists"
        } as IAPIError : {err: "Erreur inconnue"} as IAPIError
    });
    if (isApiError(res)) {
        return res
    }
}
const removeModVersion = async (modVersion: string) => {
    const result = await modVersions.findOne({version: modVersion});
    if (result == null) {
        return {err: "versionNotFound", status: 404} as IAPIError;
    }
    await modVersions.findOneAndDelete({version: modVersion});
    await modVersionsFiles.findOneAndDelete({version: modVersion});
}
const getWorldCode = async (worldId: string) => {
    const world = await worldCodes.findOne({code: worldId});
    if (world == null) {
        return undefined;
    }
    return world;
}
export default doDBOperation;