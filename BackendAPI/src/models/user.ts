import {ObjectId} from 'mongodb';

export interface IUser {
    id: ObjectId | undefined;
    username: string;
    password: string;
    email: string;
    confirmedEmail: boolean;
    creationDate: string;
    linkedWorlds: string[];
}