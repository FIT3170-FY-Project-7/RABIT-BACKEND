import RestErrorResponse from "../../RestErrorResponse";

/**
 * Error class for invalid login.
 */
export class InvalidCredentialsError extends RestErrorResponse {
    constructor() {
        super("/errors/invalid-credentials", "Invalid Credentials", 404, "Invalid email and/or password.", "/user/login")
    }
}

/**
 * Error class for signup errors.
 */
export class InvalidSignUpError extends RestErrorResponse {
    constructor() {
        super("/errors/invalid-signup", "Invalid Sign-Up", 404, "Email taken and/or invalid password.", "/user/signup")
    }
}