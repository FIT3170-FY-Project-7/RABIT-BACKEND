/**
 * Request body for login.
 */
export interface LoginData {
    readonly email: string,
    readonly password: string,
}

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

/**
 * Request body for user sign up
 */
export interface SignUpData {
    readonly email: string,
    readonly displayName: string,
    readonly password: string
}