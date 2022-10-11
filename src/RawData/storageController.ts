import dotenv from "dotenv";
import fs from "fs";
import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import multer, { diskStorage } from "multer";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
// must ignore because tsc does not recognise @types/jsonstream as type declaration of JSONStream
// @ts-ignore
import JSONStream from "JSONStream";
import stream from "node:stream";
import replacestream from "replacestream";
import databasePool from "../databaseConnection";
import { INSERT_BASE_PARAMETER } from "./uploadSql";
import { array } from "fp-ts";
import { boolean } from "io-ts";
import parameters from "../../../sharedData/parameterBuckets.json"

const intrinsicParameters = parameters.intrinsicParameters
const extrinsicParameters = parameters.extrinsicParameters

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
  destination: async (req, file, callback) => {
    const folder = path.join(
      process.env.DATA_PATH,
      UNPROCESSED_FOLDER,
      req.body.fileId
    );
    await mkdir(folder, { recursive: true });
    callback(null, folder);
  },
  filename: (req, file, callback) => {
    callback(null, req.body.chunkCount);
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

const createStreamFromChunks = async (filePath: string) => {
  const fileStream = new stream.PassThrough();
  const chunks = await readdir(filePath);
  for (const chunk of chunks) {
    const buffer = await readFile(path.join(filePath, chunk));
    fileStream.write(buffer);
  }
  fileStream.end();

  return fileStream;
};

const splitRawDataStreamIntoParameters = async (
  fileStream: stream.PassThrough,
  fileId: string,
  filePath: string,
  selectedBuckets: boolean[]
) =>
  new Promise((resolve, reject) => {
    // console.log(selectedBuckets)
    // console.log(intrinsicParameters)
    const outstandingFunctions: (() => Promise<void>)[] = [];
    fileStream
      .pipe(replacestream(/:\s*Infinity/g,':null'))
      .pipe(JSONStream.parse(["posterior", "content", { emitKey: true }]))
      .on("data", async (data: { key: string; value: any[] }) => {

        if ((selectedBuckets[0] == true && intrinsicParameters.includes(data.key)) ||
        (selectedBuckets[1] == true && extrinsicParameters.includes(data.key)) ||
        ((selectedBuckets[2] == true && (
            !(intrinsicParameters.includes(data.key))
            && !(extrinsicParameters.includes(data.key))
          ))
        )) {
          const saveParameter = async () => {
            const parameterId = uuidv4();
            const filepath = path.join(
              process.env.DATA_PATH,
              PROCESSED_FOLDER,
              fileId,
              parameterId + ".json"
            );
            await databasePool.query(INSERT_BASE_PARAMETER, [
              parameterId,
              data.key,
              fileId
            ]);
            await writeFile(filepath, JSON.stringify(data.value), {
              flag: "w+"
            });
          };
          outstandingFunctions.push(saveParameter);
        }
      
        // TODO: Pause stream until processed
      })
      .on("error", (err: any) => reject(err))
      .on("end", async () => {
        console.log("Waiting for parameters");

        if(outstandingFunctions.length == 0){
          reject(new Error("No valid Parameters"))
        }

        // Wait sequentially to avoid database from timing out
        for (const parmeterFunction of outstandingFunctions) {
          await parmeterFunction();
        }
        console.log("Finished processing", filePath);
        resolve(undefined);
      });
  });

export const processRawDataFile = async (fileId: string, selectedBuckets: boolean[]) => {
  const filePath = path.join(process.env.DATA_PATH, UNPROCESSED_FOLDER, fileId);
  console.log("Processing", filePath);
  await mkdir(path.join(process.env.DATA_PATH, PROCESSED_FOLDER, fileId), {
    recursive: true
  });

  const fileStream = await createStreamFromChunks(filePath);
  await splitRawDataStreamIntoParameters(fileStream, fileId, filePath, selectedBuckets);
  await rm(filePath, { recursive: true });
};
