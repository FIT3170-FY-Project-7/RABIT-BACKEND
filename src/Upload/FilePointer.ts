import { v4 } from "uuid";
import { Upload } from "./Upload";

export interface FilePointer {
    readonly id: typeof v4
    uploadDetails: Upload
}
