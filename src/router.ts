import { Router } from "express";

import plotController from "./Plot/PlotController";
import rawDataController from "./RawData/RawDataController";
import {invalidCredentialsErrorHandler, invalidSignUpErrorHandler} from "./ExpressErrorHandlers";
import userController from "./User/UserController";

const router = Router();
router.use("/plot", plotController);
router.use("/raw-data", rawDataController);

router.use(invalidCredentialsErrorHandler);
router.use(invalidSignUpErrorHandler);

export default router;
