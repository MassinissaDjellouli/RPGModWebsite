export const validateInscriptionFields = (state: any): any => {
    const fieldErrors = {
        username: false,
        email: false,
        pwd: false,
        pwdConfirm: false,
        errors: ""
    }
    if (!validateUsername(fieldErrors, state)) return fieldErrors;
    if (!validateEmail(fieldErrors, state)) return fieldErrors;
    if (!validatePwd(fieldErrors, state)) return fieldErrors;
    validatePwdConfirm(fieldErrors, state)
    return fieldErrors;
}
export const validateLoginFields = (state: any): any => {
    const fieldErrors: any = {
        username: false,
        password: false,
        errors: ""
    }
    if (!isEmailAddress(state.username)) {
        if (!validateUsername(fieldErrors, state)) return fieldErrors;
    }
    validatePwd(fieldErrors, state)
    return fieldErrors;
}
export const validateAdminLoginFields = (state: any): any => {
    const fieldErrors: any = {
        username: false,
        password: false,
        errors: ""
    }
    if (!validateUsername(fieldErrors, state)) return fieldErrors;
    validatePwd(fieldErrors, state, 32)
    return fieldErrors;
}
const validateUsername = (fieldErrors: any, state: any): boolean => {
    console.log(state)
    const error = fieldErrors.username = state.username.length < 3;
    fieldErrors.errors = error ? "Le nom d'utilisateur doit faire au moins 3 caractères" : "";
    return !error;
}
const validateEmail = (fieldErrors: any, state: any): boolean => {
    const error = fieldErrors.email = !isEmailAddress(state.email);
    fieldErrors.errors = error ? "L'adresse email n'est pas valide" : "";
    return !error;
}
const validatePwd = (fieldErrors: any, state: any, length: number = 8): boolean => {
    const error = fieldErrors.password = state.password.length < length;
    fieldErrors.errors = error ? `Le mot de passe doit faire au moins ${length} caractères` : "";
    return !error;
}
const validatePwdConfirm = (fieldErrors: any, state: any): boolean => {
    const error = fieldErrors.pwdConfirm = state.pwdConfirm.length < 8 || state.pwdConfirm !== state.password;
    fieldErrors.errors = error ? "Les mots de passe ne correspondent pas" : "";
    return !error;
}
export const isEmailAddress = (toCheck: string): boolean => {
    if (toCheck == undefined) return true;
    const emailRegex = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/
    return emailRegex.test(toCheck)

}