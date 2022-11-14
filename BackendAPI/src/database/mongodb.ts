import { MongoClient, MongoClientOptions, ObjectId, ServerApiVersion } from "mongodb";
import { IUser } from '../models/user';
import { IAPIError, isApiError } from '../models/error';
import { IUserStats } from '../models/userStats';
import { IConfirmationCode } from '../models/confirmationCode';
import UUID from 'uuid';

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@rpgmoddb.kn2lpmy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, 
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            serverApi: ServerApiVersion.v1,
            pkFactory: { createPk: () => new ObjectId() }
        } as MongoClientOptions);

const DB_NAME = process.env.DB_NAME;

export const init = async () => {
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    const userStats = db.collection("usersStats");
    const confirmationCodes = db.collection("confirmationCodes");
    await users.createIndex({username: 1}, {unique: true});
    await users.createIndex({email:1}, {unique: true});
    await userStats.createIndex({userId:1}, {unique: true});
    await confirmationCodes.createIndex({code:1}, {unique: true});
    await confirmationCodes.createIndex({userId:1}, {unique: true});
    console.log("Database initialized");
} 

const doDBOperation = async <ExpectedReturn>(operation:string,data?:any):Promise<ExpectedReturn | IAPIError | undefined> => {
    try{
        switch(operation){
            case "createUser": return await transaction<IUser>(createUser,data);
            case "getUser": return await transaction<any>(getUser,data);
            case "getUserStats": return await transaction<ObjectId>(getUserStats,data);
            case "uploadUserStats": return await transaction<ObjectId>(uploadUserStats,data);
            case "addConfirmationCode": return await transaction<IConfirmationCode>(addConfirmationCode,data);
            case "confirmEmail": return await transaction<string>(confirmEmail,data);
            case "getCode": return await transaction<string>(getCode,data);
            case "isExpired": return await transaction<string>(isExpired,data);
            case "deleteExpiredCode": return await transaction(deleteExpiredCode,data);
        }
    }catch(err){
        return {err:"unknownError"} as IAPIError;
    }
}
const createUser = async (user:IUser) => {
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    let res: ObjectId | undefined | IAPIError;
    delete user.id;
    await users.insertOne(user)
    .then((result) => res = result.insertedId)
    .catch((err) => {
        err.code == 11000 ? res = {err:"usernameOrEmailAlreadyExists"} as IAPIError : res = undefined
    });
    return res;
}

const getUser = async (body:any) => {
    if(body.username == undefined && body.email == undefined){
        return undefined;
    }
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    if(body.username != undefined){
        return users.findOne({username: body.username});
    }
    if(body.email != undefined){
        return users.findOne({email: body.email});
    }
    return {err:"emptyFields"} as IAPIError;
}

const transaction = async <DataType>(callback:Function,data?:DataType):Promise<any | IAPIError | void> => {
    const session = client.startSession();
    try {
        let result;
        session.startTransaction();
        if(data != undefined){
             result = await callback(data);
        }else{
             result = await callback();
        }
        if(result != undefined || result != null){
            const toReturn = isApiError(result) ? result as IAPIError : result
            await session.commitTransaction();
            return toReturn;
        }
        await session.commitTransaction();
        console.log("Transaction committed");
    }catch (err) {
        await session.abortTransaction();
        return {err:"transactionAborted"} as IAPIError;

    }finally{
        session.endSession();
    }
        
}

const getUserStats = async (id:ObjectId) => {
    const db = client.db(DB_NAME);
    const users = db.collection("usersStats");
    return users.findOne({userId: id});
}

const uploadUserStats = async (stats:IUserStats) => {
    const db = client.db(DB_NAME);
    const users = db.collection("usersStats");
    delete stats.id;
    const userStats = await users.findOne({userId: stats.userId})
    if(userStats == null){
        await users.insertOne(stats)
        return;
    }
    await users.updateOne({userId: stats.userId}, {$set: stats});
}

const addConfirmationCode = async (code:IConfirmationCode) => {
    const db = client.db(DB_NAME);
    const users = db.collection("confirmationCodes");
    let res:string | IAPIError = "";
    let wrongCode = true;
    while(wrongCode){
        await users.insertOne(code)
        .then((_) => {
            res = code.code;
            wrongCode = false;
        })
        .catch((err) => {
            err.code == 11000 ? wrongCode = true : res = {err:"unknownError"} as IAPIError;
            code.code = UUID.v4().toString();
        });
    }
    return res;
}

const confirmEmail = async (code:string) => {
    const db = client.db(DB_NAME);
    const codes = db.collection("confirmationCodes");
    const users = db.collection("users");
    const confirmationCode = await codes.findOne({code: code});
    if(confirmationCode == null){
        return {err:"wrongCode"} as IAPIError;
    }
    if(confirmationCode.expirationDate < new Date()){
        return {err:"expired"} as IAPIError;
    }
    await users.updateOne({id: confirmationCode.userId}, {$set: {emailConfirmed: true}});
    await codes.deleteOne({code: code});
}
const getCode = async (userId:string) => {
    const db = client.db(DB_NAME);
    const codes = db.collection("confirmationCodes");
    const code = await codes.findOne({userId: userId});
    if(code == null){
        return {err:"noUser"} as IAPIError;
    }
    return code.code;
}

const isExpired = async (code: string) => {
    const db = client.db(DB_NAME);
    const codes = db.collection("confirmationCodes");
    const confirmationCode = await codes.findOne({code: code});
    if(confirmationCode == null){
        return false;
    }
    if(confirmationCode.endTime < new Date()){
        return true;
    }
    return false;
}

const deleteExpiredCode = async (code:string) => {
    const db = client.db(DB_NAME);
    const codes = db.collection("confirmationCodes");
    
    await codes.findOneAndDelete({code: code});
}
export default doDBOperation;