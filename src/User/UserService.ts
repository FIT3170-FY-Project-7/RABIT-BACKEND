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

function login(credentials: Login): Promise<string> {
    let uid = findUserByEmail(credentials.email).id;
    return getAuth().createCustomToken(uid.toString());
}

function createAccount(userDetails: SignUpData) { }
