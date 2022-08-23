import { Router } from "express";

import uploadController from "./Upload/UploadController";
import shareController from "./Share/ShareController";
import rawDataController from "./RawData/RawDataController";

const router = Router();
router.use("/upload", uploadController);
router.use("/share", shareController);
router.use("/raw-data", rawDataController);

export default router;
