import {type IAPIError, isApiError} from "@/models/error";
import axios from "axios";
import handleError from "./errorHandlerUtil";

const API_URL = "http://localhost:5555/api";
export const doAndHandlePutRequest = async (endpoint: string, data?: any, token?: string): Promise<void | IAPIError> => {
    const result = await doRequest('put', endpoint, data, token)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
}
export const doAndHandlePostRequest = async (endpoint: string, data?: any, token?: string): Promise<void | IAPIError> => {
    const result = await doRequest('post', endpoint, data, token)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
}
export const doAndHandleTypedPostRequest = async <ReturnType>(endpoint: string, data?: any, token?: string): Promise<ReturnType | IAPIError> => {
    const result = await doRequest('post', endpoint, data, token)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
    return result as ReturnType;
}
export const doAndHandleGetRequest = async <ReturnType>(endpoint: string, data?: any, token?: string): Promise<ReturnType | IAPIError> => {
    const result = await doRequest('get', endpoint, data, token)
    if (isApiError(result)) {
        return handleError(result) as IAPIError;
    }
    return result as ReturnType;
}
export const getMinecraftVersions = async (): Promise<string[]> => {
    const LATEST_VERSION = ["1.19.2"];
    try {
        const response = await axios.get("https://piston-meta.mojang.com/mc/game/version_manifest.json")
        if (response.status === 200) {
            return response.data.versions.filter((version: any) => version.type === "release").map((version: any) => version.id) as string[]
        }
        return LATEST_VERSION
    } catch {
        return LATEST_VERSION
    }
}
export const doRequest = async (verb: string, endpoint: string, data?: any, token?: string): Promise<any | IAPIError> => {
    try {
        const result = await axios({
            headers: token != undefined ? {'Authorization': 'Bearer ' + token} : undefined,
            method: verb,
            url: `${API_URL}/${endpoint}`,
            data: data
        })
        if (isApiError(result.data)) {
            return {status: result.status, err: result.data.err} as IAPIError;
        }
        return result.data;
    } catch (err: any) {
        if (err.response == undefined) {
            return {status: 500, err: "Erreur inconnue"} as IAPIError;
        }
        if (!isApiError(err.response.data)) {
            return {status: err.response.status, err: err.response.data} as IAPIError;
        }
        err.response.data.status = err.response.status;
        return err.response.data as IAPIError;
    }
}
