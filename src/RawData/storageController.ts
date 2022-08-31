import fs from "fs";
import dotenv from "dotenv";
import path from "node:path";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { promisify } from "util";

const readFilePromise = promisify(fs.readFile);

if (!process.env.DATA_PATH) {
    dotenv.config();
}
if (process.env.DATA_PATH) {
    console.log("Storage controller configured at", process.env.DATA_PATH);
    fs.mkdir(process.env.DATA_PATH, { recursive: true }, (err) => {
        if (err) throw err;
    });
} else {
    console.error("DATA_PATH environment variable is not set");
}

const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.DATA_PATH);
    },
    filename: (req, file, callback) => {
        const filenameId = uuidv4();
        console.log("Received uploaded file:", filenameId);
        callback(null, filenameId + ".json");
    }
});
export const upload = multer({ storage });

export const readRawDataFile = async (filename: string) => {
    const filepath = path.join(process.env.DATA_PATH, filename + ".json");

    try {
        const data = await readFilePromise(filepath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Failed to read file", err);
    }
};
