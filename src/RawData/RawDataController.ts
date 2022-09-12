import { Router, Request, Response } from "express";
import databaseConnection, {
  FilePointer,
  PlotCollection,
  toDBDate,
  Upload
} from "../databaseConnection";
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
  RawDataListValidator,
  RawDataFileIdsValidator,
  RawDataProcessValidator,
  RawDataFileIds,
  RawDataProcess
} from "./RawDataInterfaces/RawDataValidators";
import { TypedRequestBody } from "src/TypedExpressIO";
import validateBody from "../ValidateBody";
import { getPlotCollectionDataset } from "./RawDataServices/RawDataRepositories/RetrieveRawData";
import databasePool from "../databaseConnection";
import { BaseParameterRow } from "src/Plot/PlotInterfaces/GetPlotDataDTOs";

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

router.post("/chunk", upload.single("chunk"), (req: Request, res: Response) => {
  res.status(200).send({ message: "Chunk succesfully uploaded" });
});

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
