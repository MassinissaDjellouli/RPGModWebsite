export interface IConfirmationCode {
    time: Date;
    code: string;
    userId: string;
    endTime: Date;
}