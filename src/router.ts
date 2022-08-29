import { Router } from "express";

import plotController from "./Plot/PlotController";
import rawDataController from "./RawData/RawDataController";

const router = Router();
router.use("/plot", plotController);
router.use("/raw-data", rawDataController);

export default router;
