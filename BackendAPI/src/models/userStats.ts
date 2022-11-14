import { ObjectId } from 'mongodb';
export interface IUserStats {
    id: ObjectId | undefined;
    userId: ObjectId;
}