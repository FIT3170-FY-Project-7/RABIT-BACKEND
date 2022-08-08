
interface Login {
    readonly username: string,
    readonly password: string,
}

function login(credentials: Login) {}

function logout() {}

function createAccount() {}
