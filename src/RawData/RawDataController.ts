import { Router, Request, Response } from "express";
import databaseConnection, {
  toDBDate,
  PlotCollection,
  FilePointer,
  Upload
} from "../databaseConnection";
import { v4 as uuidv4 } from "uuid";
import { readRawDataFile, upload } from "./storageController";
import {
  INSERT_UPLOAD,
  INSERT_FILE,
  GET_ALL_PLOT_COLLECTIONS,
  GET_PLOT_COLLECTION,
  GET_COLLECTIONS_FOR_USER
} from "./uploadSql";
import {
  RawDataGet,
  RawDataGetValidator,
  RawDataList,
  RawDataListValidator
} from "./RawDataInterfaces/RawDataValidators";
import { TypedRequestBody } from "src/TypedExpressIO";
import validateBody from "../ValidateBody";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();

// Can't use validator as multer uses form data to submit files
router.post("/", upload.any(), async (req: Request, res: Response) => {
  if (!req.files || !req.body.name) {
    res.status(400).send({ message: "Missing file or name parameters" });
    return;
  }

  const collectionId = uuidv4();
  const fileIds: string[] | undefined = Array.prototype.map.call(
    req?.files,
    (file: Express.Multer.File) => file.filename.split(".")[0]
  );
  // As a temporary measure until the DB is updated to the latest schema
  const uploadId = fileIds[0]; // const uploadId = uuidv4();

  // Insert plot collection and upload
  await databaseConnection.query(INSERT_UPLOAD, [
    uploadId,
    TEMP_USER,
    toDBDate(new Date()),
    collectionId,
    req.body.name
  ]);

  // Insert file pointers simultaneously
  const fileInserts = fileIds?.map((fileId) =>
    databaseConnection.query(INSERT_FILE, [uploadId, collectionId])
  );
  await Promise.all(fileInserts);

  res.status(200).send({ id: collectionId });
});

router.get(
  "/",
  validateBody(RawDataListValidator),
  async (req: TypedRequestBody<RawDataList>, res: Response) => {
    const [rawDataList] = await databaseConnection.query(
      GET_ALL_PLOT_COLLECTIONS
    );

    res.send(rawDataList);
  }
);

router.get(
  "/:id",
  validateBody(RawDataGetValidator),
  async (req: TypedRequestBody<RawDataGet>, res: Response) => {
    const [rows] = await databaseConnection.query<
      (PlotCollection | FilePointer | Upload)[]
    >(GET_PLOT_COLLECTION, [req.params.id]);
    const row = rows[0];

    const data = await readRawDataFile(row.upload_id);
    res.send({
      id: req.params.id,
      name: row.collection_name,
      data
    });
  }
);

router.get(
  "/user/:id",
  validateBody(RawDataGetValidator),
  async (req: TypedRequestBody<RawDataGet>, res: Response) => {
    const [collections] = await databaseConnection.query<
      (PlotCollection | FilePointer | Upload)[]
    >(GET_COLLECTIONS_FOR_USER, [req.params.id]);

    res.send(collections)
  }
);

export default router;
