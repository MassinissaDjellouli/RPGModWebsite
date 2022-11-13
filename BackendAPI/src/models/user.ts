import { ObjectId } from 'mongodb';
export interface User {
    id: ObjectId | undefined;
    username: string;
    password: string;
    email: string;
    confirmedEmail: boolean;
    creationDate: string;
    linked: boolean;
}