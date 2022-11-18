import type {IAPIError} from "@/models/error";

const handleError = (err: IAPIError) => {
    switch (err.status) {
        case 400:
            return handle400(err);
        case 401:
            return handle401(err);
        case 403:
            return handle403(err);
        case 404:
            return handle404(err);
        case 418:
            return handle418(err);
        case 422:
            return handle422(err);
        case 500:
            return handle500(err);
    }
}
const handle400 = (error: IAPIError) => {
    switch (error.err) {
        case 'wrongUser':
            error.err = "Ce code est invalide";
            return error;
    }
    console.log(error)
}
const handle401 = (error: IAPIError) => {
    console.log(error)
}
const handle403 = (error: IAPIError) => {
    switch (error.err) {
        case 'alreadyConfirmed':
            error.err = "Votre compte est déjà confirmé";
            return error;
    }
    console.log(error)
}
const handle404 = (error: IAPIError) => {
    console.log(error)
    switch (error.err) {
        case 'wrongEmail':
            error.err = "Cette addresse email n'existe pas";
            return error;
        case 'wrongUsername':
            error.err = "Ce nom d'utilisateur n'existe pas";
            return error;
    }
}
const handle418 = (error: any) => {
    console.log(error)
    window.alert("babbage")
}
const handle422 = (error: IAPIError) => {
    console.log(error)
    switch (error.err) {
        case 'usernameOrEmailAlreadyExists':
            error.err = "Ce nom d'utilisateur ou cette addresse email existe déjà";
            return error;
    }
}
const handle500 = (error: IAPIError) => {
    switch (error.err) {
        case 'Erreur inconnue':
            return error;
    }
    console.log(error)
}
export default handleError;