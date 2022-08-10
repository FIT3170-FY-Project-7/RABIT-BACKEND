import { User } from "src/User/User";
import { v4 } from "uuid";

export interface Upload {
    readonly id: typeof v4
    author: User
    uploadDateTime: Date
}
