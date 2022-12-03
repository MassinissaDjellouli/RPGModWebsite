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
        case 'noUsernameOrEmail':
            error.err = "Vous devez remplir les champs"
            return error
        default :
            return error
    }
}
const handle401 = (error: IAPIError) => {
    switch (error.err) {
        case 'alreadyConfirmed':
            error.err = "Cette addresse email est déja confirmée";
            return error;
        default :
            return error
    }
}
const handle403 = (error: IAPIError) => {
    switch (error.err) {
        case 'unconfirmedEmail':
            error.err = "Votre addresse email n'a pas été confirmée";
            return error;
        case 'alreadyConfirmed':
            error.err = "Votre compte est déjà confirmé";
            return error;
        case 'password':
            error.err = "Mot de passe incorrect";
            return error;
        default :
            return error
    }
}
const handle404 = (error: IAPIError) => {
    console.log(error)
    switch (error.err) {
        case 'emailNotFound':
        case 'wrongEmail':
            error.err = "Cette addresse email n'existe pas";
            return error;
        case 'wrongUsername':
            error.err = "Ce nom d'utilisateur n'existe pas";
            return error;
        case 'modNotFound':
            error.err = "Cette version n'existe pas";
            return error
        default :
            return error
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
        case 'versionAlreadyExists':
            error.err = "Cette version existe déjà";
            return error;
        case 'codeAlreadyUsed':
            error.err = "Ce monde est déjà lié"
            return error
        default :
            return error
    }
}
const handle500 = (error: IAPIError) => {
    switch (error.err) {
        case 'emailNotSent':
            error.err = "L'email n'a pas pu être envoyé. Veuillez réessayer plus tard";
            return error;
        case 'Erreur inconnue':
            return error;
        default :
            return error
    }
    console.log(error)
}
export default handleError;