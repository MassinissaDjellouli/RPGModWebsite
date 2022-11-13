export interface APIError {
    err: string;
}

export function isApiError(object: any): object is APIError {
    try{
        return 'err' in object;
    }catch{
        return false;
    }
}