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
import { TypedRequestBody, TypedRequestQuery } from "src/TypedExpressIO";
import validateBody from "../ValidateBody";
import { parameterParse } from "../Request/RequestParse";
import { RawDataRequestQuery } from "src/Request/Request";
import {
  calculateParameters,
  filterPosteriorsFromDataset,
  getMultiplePosteriorData,
  getMultipleRawData,
  getPosteriorData
} from "./RawDataServices/RawDataService";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();

// Can't use validator as multer uses form data to submit files
router.post("/", upload.any(), async (req: Request, res: Response) => {
  if (!req.files || !req.body.title || !req.body.description) {
    res.status(400).send({
      message: "Missing file, name or description parameters"
    });
    return;
  }

  const uploadId = uuidv4();
  const collectionId = uuidv4();
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
    req.body.title,
    req.body.description
  ]);

  // Insert file pointers simultaneously
  const fileInserts = fileIds?.map((fileId) =>
    databaseConnection.query(INSERT_FILE, [fileId, uploadId, collectionId])
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
    // Extract request data
    const collection_id = req.params.id;

    // Return the raw data for each file and the set of usable parameters for the plot collection
    res.status(200).send({
      id: collection_id,
      ...(await getMultipleRawData(collection_id))
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

router.get(
  "/:id/posteriors",
  validateBody(RawDataGetValidator),
  async (req: TypedRequestQuery<RawDataRequestQuery>, res: Response) => {
    // Extract request data
    const collection_id = req.params.id;
    const queryPosteriors = parameterParse(req.query?.parameters);

    // Return the filtered posterior data
    res.status(200).send({
      id: collection_id,
      ...(await getMultiplePosteriorData(collection_id, queryPosteriors))
    });
  }
);

export default router;
