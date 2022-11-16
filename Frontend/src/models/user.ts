export interface IUser {
    id: string | undefined;
    username: string;
    password: string;
    email: string;
    confirmedEmail: boolean;
    creationDate: string;
    linked: boolean;
}

export interface ITempUser {
    username?: string;
    password: string;
    email?: string;
}