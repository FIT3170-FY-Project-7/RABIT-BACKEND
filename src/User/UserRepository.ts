import { v4 } from "uuid";

export interface User {
    readonly id: typeof v4
    displayName: string
    email: string
}

function findUserByid(id: typeof v4): User | null {
    return null;
}
