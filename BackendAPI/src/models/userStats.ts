import { ObjectId } from 'mongodb';
export interface UserStats {
    id: ObjectId | undefined;
    userId: ObjectId;
}