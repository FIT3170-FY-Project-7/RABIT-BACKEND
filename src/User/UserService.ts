
interface Login {
    readonly email: string,
    readonly password: string,
}

interface SignUpData {
    readonly email: string,
    readonly displayName: string,
    readonly password: string,
}

function login(credentials: Login) {}

function createAccount(userDetails: SignUpData) {}
