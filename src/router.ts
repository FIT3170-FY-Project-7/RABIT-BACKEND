import { Router } from "express";

import shareController from "./Share/ShareController";
import rawDataController from "./RawData/RawDataController";

const router = Router();
router.use("/share", shareController);
router.use("/raw-data", rawDataController);

export default router;
