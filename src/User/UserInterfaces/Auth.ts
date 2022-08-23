import * as t from "io-ts";

export const LoginDataValidator = t.type({
    email: t.string,
    password: t.string,
});

export type LoginData = t.TypeOf<typeof LoginDataValidator>;

export const SignUpDataValidator = t.type({
    email: t.string,
    displayName: t.string,
    password: t.string
});

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
