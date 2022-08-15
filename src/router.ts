import { Router, Request, Response } from "express";
import databaseConnection, {
	toDBDate,
	PlotCollection,
	FilePointer,
	Upload,
} from "./databaseConnection";
import { v4 as uuidv4 } from "uuid";
import uploadController from "./Upload/UploadController";
import shareController from "./Share/ShareController"
import rawDataController from "./RawData/RawDataController"
import { readFile, saveFile } from "./RawData/storageController";

// Until accounts are added, all data with be under this user
const TEMP_USER = "temp";

const router = Router();
router.use("/upload", uploadController);
router.use("/share", shareController)
router.use("/raw-data", rawDataController)

export default router;
