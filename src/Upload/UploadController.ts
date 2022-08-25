import { Router, Request, Response, Express } from "express";
import sample_service from "./UploadServices/UploadService";
import { addResponseHeaders } from "../Utils";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import { upload } from "../RawData/storageController";
import databaseConnection, { toDBDate } from "../databaseConnection";
import { INSERT_FILE, INSERT_UPLOAD } from "./uploadSql";

const router = Router();

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

// This endpoint is accessed using: <API Url>/upload/sample
router.get("/sample", (req: Request, res: Response, next) => {
  addResponseHeaders(res);
  res.send(sample_service());
});

router.post("/", upload.any(), async (req: Request, res: Response) => {
  const collectionId = uuidv4();
  const uploadId = uuidv4();
  const fileIds: string[] | undefined = Array.prototype.map.call(
    req?.files,
    (file: Express.Multer.File) => file.filename.split(".")[0]
  );

  // Insert plot collection and upload
  await databaseConnection.query(INSERT_UPLOAD, [
    uploadId,
    TEMP_USER,
    toDBDate(new Date()),
    collectionId,
    req.body.name ?? "-"
  ]);

  // Insert file pointers simultaneously
  const fileInserts = fileIds?.map((fileId) =>
    databaseConnection.query(INSERT_FILE, [uploadId, collectionId])
  );
  await Promise.all(fileInserts);

  res.status(200).send({ id: collectionId });
});

// app.get('/uploads/', function (req, res) {
//     const filePath = __dirname + '/uploads/' + timeStamp + '.json'
//     res.sendFile(filePath)
// })

// app.get('/uploads/parameters', function (req, res) {
//     const filePath = __dirname + '/uploads/' + timeStamp + '.json'
//     readKeysFromPath(filePath).then((results) => {
//         res.send(results)
//       });
// })

export default router;
