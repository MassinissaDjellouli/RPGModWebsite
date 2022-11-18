export interface IAPIError {
    status: number | undefined;
    err: string;
}

export function isApiError(object: any): object is IAPIError {
    try {
        return 'err' in object;
    } catch {
        return false;
    }
}