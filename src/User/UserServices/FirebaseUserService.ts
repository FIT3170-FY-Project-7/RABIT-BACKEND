import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {LoginData, SignUpData} from "../UserInterfaces/Auth";
import {InvalidCredentialsError, InvalidSignUpError} from "../UserInterfaces/AuthError";

/**
 * Log in a user.
 * @param auth Auth object for current instance of FirebaseApp.
 * @param credentials user credentials
 * @returns JWT of user credential
 */
export function login(credentials: LoginData): Promise<string> {
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
