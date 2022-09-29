import { Response, Router } from "express";
import { BaseParameterRow } from "src/Plot/PlotInterfaces/GetPlotDataDTOs";
import { TypedRequestBody } from "src/TypedExpressIO";
import { v4 as uuidv4 } from "uuid";
import {
  default as databaseConnection, default as databasePool, FilePointer,
  PlotCollection,
  toDBDate,
  Upload
} from "../databaseConnection";
import validateBody from "../ValidateBody";
import {
  RawDataChunk,
  RawDataChunkValidator, RawDataFileIds, RawDataFileIdsValidator, RawDataGet,
  RawDataGetValidator,
  RawDataList,
  RawDataListValidator, RawDataProcess, RawDataProcessValidator
} from "./RawDataInterfaces/RawDataValidators";
import { getPlotCollectionDataset } from "./RawDataServices/RawDataRepositories/RetrieveRawData";
import {
  processRawDataFile,
  readRawDataParameter,
  upload
} from "./storageController";
import {
  GET_ALL_PLOT_COLLECTIONS, GET_BASE_PARAMETER, GET_COLLECTIONS_FOR_USER, INSERT_FILE, INSERT_UPLOAD
} from "./uploadSql";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();

router.post(
  "/file-ids",
  validateBody(RawDataFileIdsValidator),
  (req: TypedRequestBody<RawDataFileIds>, res: Response) => {
    const fileIds = new Array(req.body.fileCount)
      .fill(undefined)
      .map(() => uuidv4());

    res.status(200).send({
      fileIds
    });
  }
);

router.post(
  "/chunk",
  upload.single("chunk"),
  validateBody(RawDataChunkValidator), // Validator has to be after upload
  (req: TypedRequestBody<RawDataChunk>, res: Response) => {
    res.status(200).send({
      message: `File ${req.body.fileId}, chunk ${req.body.chunkCount} succesfully uploaded`
    });
  }
);

router.post(
  "/process",
  validateBody(RawDataProcessValidator),
  async (req: TypedRequestBody<RawDataProcess>, res: Response) => {
    const uploadId = uuidv4();
    const collectionId = uuidv4();
    const fileIds: string[] | undefined = req.body.fileIds;

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
    // Don't process simultaneously to reduce load
    for (const fileId of fileIds) {
      await processRawDataFile(fileId);
    }

    res.status(200).send({ id: collectionId, fileIds });
  }
);

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

    const [baseParameter] = await databasePool.query<BaseParameterRow[]>(
      GET_BASE_PARAMETER,
      [parameterId]
    );
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

    res.send(collections);
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
