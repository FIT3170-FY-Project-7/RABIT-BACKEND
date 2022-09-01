import { readFile, writeFile, mkdir } from "fs/promises";
import fs from "fs";
import dotenv from "dotenv";
import path from "node:path";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
// must ignore because tsc does not recognise @types/jsonstream as type declaration of JSONStream
// @ts-ignore
import JSONStream from "JSONStream";
import stream from "node:stream";
import databasePool from "../databaseConnection";
import { INSERT_BASE_PARAMETER } from "./uploadSql";

const UNPROCESSED_FOLDER = "unprocessed";
const PROCESSED_FOLDER = "processed";

if (!process.env.DATA_PATH) {
  dotenv.config();
}
if (process.env.DATA_PATH) {
  console.log("Storage controller configured at", process.env.DATA_PATH);
  const folders = [PROCESSED_FOLDER, UNPROCESSED_FOLDER];
  folders.map((folder) => {
    fs.mkdir(
      path.join(process.env.DATA_PATH, folder),
      { recursive: true },
      (err) => {
        if (err) {
          console.error("Failed to create folder", folder);
        }
      }
    );
  });
} else {
  console.error("DATA_PATH environment variable is not set");
}

const storage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(process.env.DATA_PATH, UNPROCESSED_FOLDER));
  },
  filename: (req, file, callback) => {
    const filenameId = uuidv4();
    callback(null, filenameId + ".json");
  }
});
export const upload = multer({ storage });

export const readRawDataParameter = async (
  fileId: string,
  parameterId: string
) => {
  const filepath = path.join(
    process.env.DATA_PATH,
    PROCESSED_FOLDER,
    fileId,
    parameterId + ".json"
  );

  try {
    const data = await readFile(filepath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read file", err);
  }
};

export const processRawDataFile = async (fileId: string) => {
  const filepath = path.join(
    process.env.DATA_PATH,
    UNPROCESSED_FOLDER,
    fileId + ".json"
  );
  console.log("Processing", filepath);

  await mkdir(path.join(process.env.DATA_PATH, PROCESSED_FOLDER, fileId), {
    recursive: true
  });

  const buffer = await readFile(filepath);
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  await new Promise((resolve, reject) => {
    bufferStream
      .pipe(JSONStream.parse(["posterior", "content", { emitKey: true }]))
      .on("data", async (data: { key: string; value: any[] }) => {
        const parameterId = uuidv4();
        const filepath = path.join(
          process.env.DATA_PATH,
          PROCESSED_FOLDER,
          fileId,
          parameterId + ".json"
        );
        console.log("Writing", filepath);
        // Keep synchronous to reduce load
        await databasePool.query(INSERT_BASE_PARAMETER, [
          parameterId,
          data.key,
          fileId
        ]);
        await writeFile(filepath, JSON.stringify(data.value), { flag: "w+" });
        console.log("Writing end", filepath);
      })
      .on("error", (err) => reject(err))
      .on("end", () => {
        console.log("Finished processing", filepath);
        resolve(undefined);
      });
  });
};
