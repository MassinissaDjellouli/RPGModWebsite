import { MongoClient, MongoClientOptions, ObjectId, ServerApiVersion } from "mongodb";
import { User } from '../models/user';
import { APIError, isApiError } from '../models/error';
import { UserStats } from '../models/userStats';
import { ConfirmationCode } from '../models/confirmationCode';
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
    console.log("Database initialized");
} 

const doDBOperation = async <ExpectedReturn>(operation:string,data?:any):Promise<ExpectedReturn | APIError | undefined> => {
    try{
        switch(operation){
            case "createUser": return await transaction<User>(createUser,data);
            case "getUser": return await transaction<any>(getUser,data);
            case "getUserStats": return await transaction<ObjectId>(getUserStats,data);
            case "uploadUserStats": return await transaction<ObjectId>(uploadUserStats,data);
            case "addConfirmationCode": return await transaction<ConfirmationCode>(addConfirmationCode,data);
        }
    }catch(err){
        console.log(err);
        return {err:"unknownError"} as APIError;
    }
}
const createUser = async (user:User) => {
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    let res: ObjectId | undefined | APIError;
    delete user.id;
    await users.insertOne(user)
    .then((result) => res = result.insertedId)
    .catch((err) => {
        console.log(err);
        err.code == 11000 ? res = {err:"usernameOrEmailAlreadyExists"} as APIError : res = undefined
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
    return {err:"emptyFields"} as APIError;
}

const transaction = async <DataType>(callback:Function,data?:DataType):Promise<any | APIError | void> => {
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
            const toReturn = isApiError(result) ? result as APIError : result
            await session.commitTransaction();
            return toReturn;
        }
        await session.commitTransaction();
        console.log("Transaction committed");
    }catch (err) {
        await session.abortTransaction();
        console.error(err)
        return {err:"transactionAborted"} as APIError;

    }finally{
        session.endSession();
    }
        
}

const getUserStats = async (id:ObjectId) => {
    const db = client.db(DB_NAME);
    const users = db.collection("usersStats");
    return users.findOne({userId: id});
}

const uploadUserStats = async (stats:UserStats) => {
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

const addConfirmationCode = async (code:ConfirmationCode) => {
    const db = client.db(DB_NAME);
    const users = db.collection("confirmationCodes");
    let res:string | APIError = "";
    let wrongCode = true;
    while(wrongCode){
        await users.insertOne(code)
        .then((_) => {
            res = code.code;
            wrongCode = false;
        })
        .catch((err) => {
            err.code == 11000 ? wrongCode = true : res = {err:"unknownError"} as APIError;
            code.code = UUID.v4().toString();
        });
    }
    return res;
}
export default doDBOperation;