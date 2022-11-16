export const validateInscriptionFields = (state:any):any => {
    const fieldErrors = {
        username: false,
        email: false,
        pwd: false,
        pwdConfirm: false,
        errors: ""
    }
    if(!validateUsername(fieldErrors,state)) return fieldErrors;
    if(!validateEmail(fieldErrors,state)) return fieldErrors;
    if(!validatePwd(fieldErrors,state)) return fieldErrors;
    validatePwdConfirm(fieldErrors,state)
    return fieldErrors;
}
const validateUsername = (fieldErrors:any,state:any):boolean => {
    const error = fieldErrors.username = state.username.length < 3;
    fieldErrors.errors = error ? "Le nom d'utilisateur doit faire au moins 3 caractères":"";
    return !error;
}
const validateEmail = (fieldErrors:any,state:any):boolean => {
    const emailRegex = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/
    const error = fieldErrors.email = !emailRegex.test(state.email);
    fieldErrors.errors = error ? "L'adresse email n'est pas valide":"";
    return !error;
}
const validatePwd = (fieldErrors:any,state:any):boolean => {
    const error = fieldErrors.pwd = state.pwd.length < 8;
    fieldErrors.errors = error ? "Le mot de passe doit faire au moins 8 caractères":"";
    return !error;
}
const validatePwdConfirm = (fieldErrors:any,state:any):boolean => {
    const error = fieldErrors.pwdConfirm  = state.pwdConfirm.length < 8 || state.pwdConfirm !== state.pwd;
    fieldErrors.errors = error?"Les mots de passe ne correspondent pas":"";
    return !error;
}