import { Router, Request, Response } from "express";

import validateBody from "../ValidateBody";
import { TypedRequestBody } from "../TypedExpressIO";
import {
    ShareLinkGenerateValidator,
    ShareLinkGenerate,
} from "./ShareInterfaces/ShareLinkGenerate";
import { generateShareURL } from "./ShareServices/ShareService";

const router = Router();

// Route to this controller: /share

/**
 * Generate a share link for a given CornerPlot
 */
router.post(
    "",
    validateBody(ShareLinkGenerateValidator),
    (req: TypedRequestBody<ShareLinkGenerate>, res: Response) => {
        res.status(200).send(generateShareURL(req.body));
    }
);

/**
 * Get data for generating a shared corner plot, given its shared id
 */
router.get("/:id", (req: Request, res: Response, next) => {
    const id = req.params.id;

    // TODO: Add some functionality here
    res.send("In Progress");
});

export default router;
