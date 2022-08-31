/**
 * Module containing types and interfaces for login and signup.
 */
import * as t from "io-ts";

/**
 * Validator for login data.
 */
export const LoginDataValidator = t.type({
    email: t.string,
    password: t.string,
});

/**
 * Type for login request body.
 */
export type LoginData = t.TypeOf<typeof LoginDataValidator>;

/**
 * Validator for signup data.
 */
export const SignUpDataValidator = t.type({
    email: t.string,
    displayName: t.string,
    password: t.string
});

/**
 * Type for signup request body.
 */
export type SignUpData = t.TypeOf<typeof SignUpDataValidator>;

/**
 * Body of login response.
 */
export interface LoginResponse {
    readonly jwt: string
}

/**
 * Body of sign up response.
 */
export interface SignUpResponse {
    readonly jwt: string
}
