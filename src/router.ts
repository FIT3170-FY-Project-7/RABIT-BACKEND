import { Router } from "express";

import uploadController from "./Upload/UploadController";
import shareController from "./Share/ShareController";
import rawDataController from "./RawData/RawDataController";
import USER_ROUTE from "./User/UserController";
import {
    badRequestErrorHandler,
    invalidCredentialsErrorHandler,
    invalidSignUpErrorHandler
} from "./ExpressErrorHandlers";

const router = Router();
router.use("/upload", uploadController);
router.use("/user", USER_ROUTE);
router.use("/share", shareController);
router.use("/raw-data", rawDataController);

// Add error handlers

router.use(invalidCredentialsErrorHandler);
router.use(invalidSignUpErrorHandler);
router.use(badRequestErrorHandler);

export default router;
