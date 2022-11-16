import type { IUser } from '../models/user';
import axios, { AxiosError } from 'axios';
import { useLoggedInStore } from '../stores/loggedIn';
import type { ITempUser  } from '../models/user';
import type { IAPIError } from '@/models/error';
import { isApiError } from '../models/error';
import handleError from './errorHandlerUtil';
import { doRequest, doAndHandlePostRequest, doAndHandleGetRequest, doAndHandlePutRequest, doAndHandleTypedPostRequest } from './requestHandlerUtil';

export const login = async (user:ITempUser):Promise<void | IAPIError> => {
    const result = await doRequest('post', 'http://localhost:5555/api/login', user)
    if( isApiError(result) ){
        return handleError(result) as IAPIError;
    }
    const store = useLoggedInStore()
    const loginResult = await store.login(result);
    if( isApiError(loginResult) ){
        return handleError(loginResult) as IAPIError;
    }
}

export const adminLogin = async (user:ITempUser):Promise<void | IAPIError> => {
    const result = await doRequest('post', 'http://localhost:5555/api/adminLogin', user)
    if( isApiError(result) ){
        return handleError(result) as IAPIError;
    }
    const store = useLoggedInStore()
    const loginResult = await store.loginAdmin(result);
    if( isApiError(loginResult) ){
        return handleError(loginResult) as IAPIError;
    }
}
export const inscription = async (user:ITempUser):Promise<void | IAPIError> => {
    return await doAndHandlePostRequest('http://localhost:5555/api/inscription', user)

}
export const getUser = async (token:string):Promise<IUser | IAPIError> => {
    return await doAndHandleGetRequest<IUser>('get', 'http://localhost:5555/api/getUser', token=token)

}
export const confirmEmail = async (confirmationCode:string,user:ITempUser):Promise<void | IAPIError> => {
    const result = await doAndHandleTypedPostRequest<IUser>("http://localhost:5555/api/login", user)
    return(
        !isApiError(result)
        ?await doAndHandlePutRequest(`http://localhost:5555/api/confirmEmail/${confirmationCode}`, user)
        :result
     )
}
export const loginFromCookies = async ():Promise<void | IAPIError> => {
    const store = useLoggedInStore()
    if( store.token == undefined || store.token == null ){
        return;
    }
    const loginResult = await store.login(store.token);
    if( isApiError(loginResult) ){
        return handleError(loginResult) as IAPIError;
    }
}

