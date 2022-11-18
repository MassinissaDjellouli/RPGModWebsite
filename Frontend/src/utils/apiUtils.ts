import type {ITempUser, ITempUserInscription, IUser} from '../models/user';
import {useLoggedInStore} from '../stores/loggedIn';
import type {IAPIError} from '@/models/error';
import {isApiError} from '../models/error';
import handleError from './errorHandlerUtil';
import {
    doAndHandleGetRequest,
    doAndHandlePostRequest,
    doAndHandlePutRequest,
    doAndHandleTypedPostRequest,
    doRequest
} from './requestHandlerUtil';
import type {IModVersions} from "@/models/modVersions";


export const login = async (user: ITempUser): Promise<string | IAPIError> => {
    const result = await doRequest('post', 'login', user)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
    const store = useLoggedInStore()
    const loginResult = await store.login(result);
    if (isApiError(loginResult)) {
        return handleError(loginResult) as IAPIError;
    }
    return result as string;
}

export const adminLogin = async (user: ITempUser): Promise<void | IAPIError> => {
    const result = await doRequest('post', 'adminLogin', user)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
    const store = useLoggedInStore()
    const loginResult = await store.loginAdmin(result);
    if (isApiError(loginResult)) {
        return handleError(loginResult) as IAPIError;
    }
}
export const inscription = async (user: ITempUserInscription): Promise<void | IAPIError> => {
    return await doAndHandlePostRequest('inscription', user)

}
export const getUser = async (token: string): Promise<IUser | IAPIError> => {
    return await doAndHandleGetRequest<IUser>('getUser', undefined, token)

}
export const sendNewConfirmationEmail = async (email: string): Promise<void | IAPIError> => {
    return await doAndHandlePostRequest('newConfirmationEmail', {email: email})
}
export const confirmEmail = async (confirmationCode: string, user: ITempUser): Promise<void | IAPIError> => {
    const result = await doAndHandleTypedPostRequest<IUser>("login", user)
    return (
        !isApiError(result)
            ? await doAndHandlePutRequest(`confirmEmail/${confirmationCode}`, user)
            : result
    )
}
export const getModVersions = async (version: string | undefined = undefined): Promise<IModVersions[]> => {
    version = version === undefined ? "" : `/${version}`
    const resp = await doAndHandleGetRequest<IModVersions[]>(`getModVersions${version}`) as IModVersions[];
    return isApiError(resp) ? [] : resp;
}
export const loginFromCookies = async (): Promise<void | IAPIError> => {
    const store = useLoggedInStore()
    if (store.token == undefined) {
        return;
    }
    const loginResult = await store.login(store.token);
    if (isApiError(loginResult)) {
        return handleError(loginResult) as IAPIError;
    }
}
export const getModDownload = async (version: string): Promise<void | IAPIError> => {
    const result = await doAndHandleGetRequest(`getModDL/${version}`, undefined);
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
}

