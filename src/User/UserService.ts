import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { RestErrorResponse } from '../RestErrorResponse';

export interface Login {
    readonly email: string,
    readonly password: string,
}

export interface LoginResponse {
    readonly jwt: string
}

export interface SignUpResponse {
    readonly jwt: string
}

export interface SignUpData {
    readonly email: string,
    readonly displayName: string,
    readonly password: string
}
export class InvalidCredentialsError extends RestErrorResponse {
    constructor() {
        super("/errors/invalid-credentials", "Invalid Credentials", 404, "Invalid email and/or password.", "/user/login")
    }
}

export class InvalidSignUpError extends RestErrorResponse {
    constructor() {
        super("/errors/invalid-signup", "Invalid Sign-Up", 404, "Email taken and/or invalid password.","/user/SignUp")
    }
}
/**
 * Log in a user.
 * @param auth Auth object for current instance of FirebaseApp.
 * @param credentials user credentials
 * @returns JWT of user credential
 */
export function login(credentials: Login): Promise<string> {
    let auth = getAuth()
    // Firebase function for login
    return signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then((userCredential) => {
        // assign user object to return var, if login successful
        return userCredential.user.getIdToken();
    })
    .catch((error) => {
        // throw error if login failed
        throw new InvalidCredentialsError();
    });
}


/**
 * Signs up a user.
 * @param auth Auth object for current instance of FirebaseApp.
 * @param userDetails Object with details needed to sign up.
 * @returns JWT of user credential
 */
export function createAccount(userDetails: SignUpData): Promise<string> {
    let auth = getAuth()
    // Firebase auth function to create user
    return createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
        .then((userCredential) => {
            // if sign successful, assign new user object to return var
            return userCredential.user.getIdToken();
        })
        .catch((error) => {
            // throw error if sign up didnt work
            throw new InvalidSignUpError();
        });
}