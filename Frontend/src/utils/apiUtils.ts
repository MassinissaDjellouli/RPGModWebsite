import type { IUser } from '../models/user';
import axios, { AxiosError } from 'axios';
import { useLoggedInStore } from '../stores/loggedIn';
import type { IUserLogin as ITempUser } from '../models/user';
import type { IAPIError } from '@/models/error';
import { isApiError } from '../models/error';
export const login = async (user:ITempUser):Promise<void | IAPIError> => {
    const result = await doRequest('post', 'http://localhost:5555/api/login', user)
    if( isApiError(result) ){
        return handleError(result) as IAPIError;
    }
    const store = useLoggedInStore()
    const loginResult = await store.login(result.token);
    if( isApiError(loginResult) ){
        return handleError(loginResult) as IAPIError;
    }
}
export const inscription = async (user:ITempUser):Promise<void | IAPIError> => {
    const result = await doRequest('post', 'http://localhost:5555/api/inscription', user)
    if( isApiError(result) ){
        return handleError(result) as IAPIError;
    }
}
export const getUser = async (token:string):Promise<IUser | IAPIError> => {
    const result = await doRequest('get', 'http://localhost:5555/api/getUser', token=token)
    if( isApiError(result) ){
        return handleError(result) as IAPIError;
    }
    return result as IUser;
}

const doRequest = async (verb:string, url:string, data?:any,token?:string):Promise<any | IAPIError> => {
    try{
        const result = await axios({
            headers: token != undefined ? { 'Authorization': 'Bearer ' + token } : undefined,
            method: verb,
            url: url,
            data: data
        })
        return result.data;
    }catch( err:any ){
        if(!isApiError(err.response.data)){
            return {status:418,err: err.response.data} as IAPIError;
        }
        err.response.data.status = err.response.status;
        return err.response.data as IAPIError;
    }
}

const handleError = (err:IAPIError) => {
    switch( err.status ){
        case 400: return handle400(err); 
        case 401: return handle401(err); 
        case 403: return handle403(err); 
        case 404: return handle404(err); 
        case 418: return handle418(err); 
        case 422: return handle422(err); 
        case 500: return handle500(err); 
    }
}
const handle400 = (error:IAPIError) => {
    console.log(error)
}
const handle401 = (error:IAPIError) => {
    console.log(error)
}
const handle403 = (error:IAPIError) => {
    console.log(error)
}
const handle404 = (error:IAPIError) => {
    console.log(error)
    switch( error.err ){
        case 'wrongUsername': error.err = "Mauvais nom d'utilisateur"; return error;
    }
}
const handle418 = (error:any) => {
    console.log(error)
    window.alert("babbage")
}
const handle422 = (error:IAPIError) => {
    console.log(error)
}
const handle500 = (error:IAPIError) => {
    console.log(error)
}