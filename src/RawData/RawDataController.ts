import { Response, Router } from "express";
import { BaseParameterRow } from "src/Plot/PlotInterfaces/GetPlotDataDTOs";
import { TypedRequestBody } from "src/TypedExpressIO";
import { v4 as uuidv4 } from "uuid";
import {
  default as databaseConnection,
  default as databasePool,
  FilePointer,
  PlotCollection,
  toDBDate,
  Upload
} from "../databaseConnection";
import validateBody from "../ValidateBody";
import {
  RawDataGet,
  RawDataGetValidator,
  RawDataList,
  RawDataListValidator,
  RawDataFileIdsValidator,
  RawDataProcessValidator,
  RawDataFileIds,
  RawDataProcess,
  RawDataChunk,
  RawDataChunkValidator,
  FileDetails,
  GetParameterBucketsValidator,
  GetParameterBuckets
} from "./RawDataInterfaces/RawDataValidators";
import { getPlotCollectionDataset } from "./RawDataServices/RawDataRepositories/RetrieveRawData";
import {
  processRawDataFile,
  readRawDataParameter,
  upload
} from "./storageController";
import {
  GET_ALL_PLOT_COLLECTIONS,
  GET_BASE_PARAMETER,
  GET_COLLECTIONS_FOR_USER,
  INSERT_FILE,
  INSERT_UPLOAD
} from "./uploadSql";
import posterior_labels from "../posterior_latex_labels.json";
import parameterBuckets from "../parameterBuckets.json"
import { isKeyOf } from "../utils";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();

router.get(
  "/parameter-buckets",
  validateBody(GetParameterBucketsValidator),
  (req: TypedRequestBody<GetParameterBuckets>, res: Response) => {
    res.status(200).send(parameterBuckets)
  }
)

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
    const collectionId = uuidv4();

    const fileDetailsArray: FileDetails[] | undefined = req.body.fileDetails;
    const selectedBuckets = req.body.selectedBuckets


    // Insert plot collection and upload
    await databaseConnection.query(INSERT_UPLOAD, [
      collectionId,
      TEMP_USER,
      req.body.title,
      req.body.description,
      toDBDate(new Date()),
      toDBDate(new Date())
    ]);

    // Insert file pointers simultaneously
    const fileInserts = fileDetailsArray?.map((fileDetails) =>
      databaseConnection.query(INSERT_FILE, [
        fileDetails.id,
        collectionId,
        fileDetails.name
      ])
    );
    await Promise.all(fileInserts);
    // Don't process simultaneously to reduce load

    for (const fileDetails of fileDetailsArray) {
      await processRawDataFile(fileDetails.id, selectedBuckets);
    }

    res
      .status(200)
      .send({ id: collectionId, fileDetailsArray: fileDetailsArray });

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
    const posterior_data = await readRawDataParameter(fileId, parameterId);
    const parameter_name = baseParameter[0].parameter_name;
    const parameter_label = isKeyOf(posterior_labels, parameter_name)
      ? posterior_labels[parameter_name]
      : parameter_name.replace(/_/g, " ");

    res.status(200).send({
      fileId,
      parameterId,
      parameterName: parameter_name,
      parameterLabel: parameter_label,
      posterior: posterior_data
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
    const fileDetailsArray = [
      ...new Map(
        rows.map((row) => [
          row.file_id,
          { file_id: row.file_id, file_name: row.file_name }
        ])
      ).values()
    ];

    const files = fileDetailsArray.map((fileDetails) => ({
      fileId: fileDetails.file_id,
      fileName: fileDetails.file_name,
      parameters: rows
        .filter((row) => row.file_id === fileDetails.file_id)
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
