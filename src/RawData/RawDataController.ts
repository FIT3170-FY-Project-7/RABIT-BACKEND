import { Router, Request, Response } from "express";
import databaseConnection, { toDBDate } from "../databaseConnection";
import { v4 as uuidv4 } from "uuid";
import {
  processRawDataFile,
  readRawDataParameter,
  upload
} from "./storageController";
import {
  INSERT_UPLOAD,
  INSERT_FILE,
  GET_ALL_PLOT_COLLECTIONS,
  GET_COLLECTIONS_FOR_USER,
  GET_BASE_PARAMETER
} from "./uploadSql";
import {
  RawDataGet,
  RawDataGetValidator,
  RawDataList,
  RawDataListValidator
} from "./RawDataInterfaces/RawDataValidators";
import { TypedRequestBody } from "src/TypedExpressIO";
import validateBody from "../ValidateBody";
import { getPlotCollectionDataset } from "./RawDataServices/RawDataRepositories/RetrieveRawData";
import databasePool from "../databaseConnection";
import { BaseParameterRow } from "src/Plot/PlotInterfaces/GetPlotDataDTOs";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();

// Can't use validator as multer uses form data to submit files
router.post("/", upload.any(), async (req: Request, res: Response) => {
  if (!req.files || !req.body.title) {
    res.status(400).send({
      message: "Missing file or title parameters"
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

  // TODO: This can happen after the response, but need to provide some other way to let the frontend know that the processing is complete
  const processFiles = fileIds.map((fileId) => processRawDataFile(fileId));
  await Promise.all(processFiles);

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
  "/parameter/:pid",
  validateBody(RawDataGetValidator),
  async (req: TypedRequestBody<RawDataGet>, res: Response) => {
    const parameterId = req.params.pid;

    const [baseParameter] = await databasePool.query<BaseParameterRow[]>(GET_BASE_PARAMETER, [
      parameterId
    ]);
    const fileId = baseParameter[0].file_id;
    const posterior = await readRawDataParameter(fileId, parameterId);

    res.status(200).send({
      fileId,
      parameterId,
      parameterName: baseParameter[0].parameter_name,
      posterior
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
  "/plot-collection/:cid",
  validateBody(RawDataGetValidator),
  async (req: TypedRequestBody<RawDataGet>, res: Response) => {
    const collectionId = req.params.cid;
    const rows = await getPlotCollectionDataset(collectionId);

    const title = rows[0].collection_title;
    const description = rows[0].collection_description;
    const fileIds = [...new Set(rows.map((row) => row.file_id))];
    const files = fileIds.map((fileId) => ({
      fileId,
      parameters: rows
        .filter((row) => row.file_id === fileId)
        .map((row) => ({ id: row.parameter_id, name: row.parameter_name }))
    }));

    res.status(200).send({
      id: collectionId,
      title,
      description,
      files
    });
  }
);

export default router;
