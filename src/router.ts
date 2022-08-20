import { Router } from "express";

import uploadController from "./Upload/UploadController";
import plotController from "./Plot/PlotController";
import rawDataController from "./RawData/RawDataController";

const router = Router();
router.use("/upload", uploadController);
router.use("/plot", plotController);
router.use("/raw-data", rawDataController);

export default router;
