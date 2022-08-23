import { Router } from "express";

import uploadController from "./Upload/UploadController";
import shareController from "./Share/ShareController";
import rawDataController from "./RawData/RawDataController";
import {invalidCredentialsErrorHandler, invalidSignUpErrorHandler} from "./ExpressErrorHandlers";
import userController from "./User/UserController";

const router = Router();
router.use("/upload", uploadController);
router.use("/user", userController);
router.use("/share", shareController);
router.use("/raw-data", rawDataController);

router.use(invalidCredentialsErrorHandler);
router.use(invalidSignUpErrorHandler);

export default router;
