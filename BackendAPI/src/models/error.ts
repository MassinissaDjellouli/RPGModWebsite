export interface IAPIError {
    err: string;
}

export function isApiError(object: any): object is IAPIError {
    try{
        return 'err' in object;
    }catch{
        return false;
    }
}