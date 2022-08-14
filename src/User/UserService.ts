import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
export interface Login {
    readonly email: string,
    readonly password: string,
}

export interface LoginResponse {
    readonly jwt: string
}

interface SignUpData {
    readonly email: string,
    readonly displayName: string,
    readonly password: string,
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid username and/or password.");

        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
}

/**
 * Log in a user.
 * @param auth Auth object for current instance of FirebaseApp.
 * @param credentials user credentials
 * @returns UserCredential object 
 */
export function login(credentials: Login): Promise<string> {
    
    // variable for return object
    let loginUser: UserCredential|null = null
    let auth = getAuth()
    // Firebase function for login
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then((userCredential) => {
        // assign user object to return var, if login successful
        loginUser= userCredential
        
    })
    .catch((error) => {
        // throw error if login failed
        const errorCode = error.code;
        const errorMessage = error.message;
        throw new InvalidCredentialsError
    });
    return userCredtoJWT(loginUser)
}


/**
 * Signs up a user.
 * @param auth Auth object for current instance of FirebaseApp. 
 * @param userDetails Object with details needed to sign up.
 * @returns UserCredential object 
 */
export function createAccount(userDetails: SignUpData):Promise<string> { 
    // variable for return object
    let newUser: UserCredential|null = null
    let auth = getAuth()
    // Firebase auth function to create user
    createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
    .then((userCredential) => {
        
        // if sign successful, assign new user object to return var
        newUser= userCredential
        
    })
    .catch((error) => {
        // throw error if sign up didnt work
        const errorCode = error.code;
        const errorMessage = error.message;
        throw error
    });

    return userCredtoJWT(newUser)
}


function userCredtoJWT(userCred:UserCredential):Promise<string>{return}