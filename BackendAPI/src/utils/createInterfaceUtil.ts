import {IUser as IUser} from '../models/user';
import bcrypt from 'bcrypt';

export const createUser = async (body: any): Promise<IUser> => {
    return {
        id: undefined,
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        email: body.email,
        confirmedEmail: false,
        linkedWorlds: [],
        creationDate: new Date().toLocaleDateString(),
    }
}
export const createUserFromToken = (user: any): IUser => {
    return {
        id: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        confirmedEmail: user.confirmedEmail,
        linkedWorlds: user.linkedWorlds,
        creationDate: user.creationDate,
    }
}