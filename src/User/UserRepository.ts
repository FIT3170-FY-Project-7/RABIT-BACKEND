import { v4 } from "uuid";

export interface User {
    readonly id: typeof v4
    displayName: string
    email: string
}

export function findUserById(id: typeof v4): User | null {
    return null;
}

export function findUserByEmail(email: string): User | null {
    return null;
}
