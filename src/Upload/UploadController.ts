import { Router, Request, Response } from "express";
import sample_service from "./UploadServices/UploadService";
import { addResponseHeaders } from "../Utils";
const router = Router();

// Route to this controller: /upload

router.get("/", (req: Request, res: Response, next) => {
    addResponseHeaders(res);
    res.send("tests")
})

// This endpoint is accessed using: <API Url>/upload/sample
router.get("/sample", (req: Request, res: Response, next) => {
    addResponseHeaders(res);
    res.send(sample_service())
})

export default router;
