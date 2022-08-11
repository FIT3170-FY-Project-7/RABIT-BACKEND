import { getAuth } from 'firebase-admin/auth';
import { findUserByEmail } from './UserRepository';
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
 * @param credentials user credentials
 * @returns JWT token
 */
export function login(credentials: Login): Promise<string> {
    let user = findUserByEmail(credentials.email)
    if (user !== null) {
        let uid = user.id;
        return getAuth().createCustomToken(uid.toString());
    } else {
        throw new InvalidCredentialsError();
    }
}

function createAccount(userDetails: SignUpData) { }
