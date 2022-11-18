export interface IUser {
    id: string | undefined;
    username: string;
    password: string;
    email: string;
    confirmedEmail: boolean;
    creationDate: string;
    linked: boolean;
}

export type ITempUserInscription = {
    username: string;
    password: string;
    email: string;
}

export interface ITempUser {
    password: string;
}

export interface ITempUserEmail extends ITempUser {
    email: string;
}


export interface ITempUserUsername extends ITempUser {
    username: string;
}